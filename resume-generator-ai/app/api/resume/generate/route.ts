import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseJobDescription } from '@/lib/services/jobDescriptionParser'
import { tailorResume } from '@/lib/services/resumeTailoring'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { job_description } = body

    if (!job_description || !job_description.trim()) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      )
    }

    // Parse job description with OpenAI (handles both text and URL)
    console.log('Parsing job description with OpenAI...')
    const parsedJD = await parseJobDescription(job_description.trim())
    console.log('Job description parsed successfully:', parsedJD.job_title)

    // Auto-save job description with parsed data
    const { data: savedJobDesc, error: jobDescError } = await supabase
      .from('job_descriptions')
      .insert({
        user_id: user.id,
        job_title: parsedJD.job_title, // Required column
        company_name: parsedJD.company || null, // Optional column
        description_text: parsedJD.raw_text,
        parsed_keywords: {
          job_title: parsedJD.job_title,
          company: parsedJD.company,
          location: parsedJD.location,
          experience_required: parsedJD.experience_required,
          technical_skills: parsedJD.technical_skills,
          soft_skills: parsedJD.soft_skills,
          qualifications: parsedJD.qualifications,
          responsibilities: parsedJD.responsibilities,
          technologies: parsedJD.technologies,
          keywords: parsedJD.keywords,
        },
      })
      .select()
      .single()

    if (jobDescError) {
      console.error('Error saving job description:', jobDescError)
      throw new Error('Failed to save job description')
    }

    // Get user's base information for resume generation
    let { data: baseInfo, error: baseInfoError } = await supabase
      .from('base_information')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // If base_information doesn't exist, create it with empty structure
    if (baseInfoError && baseInfoError.code === 'PGRST116') {
      console.log('base_information not found, creating empty record for user')

      const { data: newBaseInfo, error: createError } = await supabase
        .from('base_information')
        .insert({
          user_id: user.id,
          personal_info: {
            full_name: '',
            email: '',
            phone: '',
            location: '',
            professional_title: '',
            linkedin_url: '',
            portfolio_url: '',
          },
          work_experience: [],
          education: [],
          skills: { technical: [], soft: [], languages: [], certifications: [] },
          additional_sections: { projects: [], volunteer: [], awards: [], publications: [] },
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating base_information:', createError)
        // Continue with null baseInfo - will use fallback values
      } else {
        baseInfo = newBaseInfo
      }
    }

    // Create a new resume with basic content
    // Use parsed job title for resume title
    const resumeTitle = parsedJD.job_title && parsedJD.job_title !== 'Position from Job Description'
      ? `Resume for ${parsedJD.job_title}`.substring(0, 100)
      : 'New Resume'

    // Create resume content from base information
    // Map base_information structure to ResumeContent structure
    // Note: Check if personal_info has actual data (not just empty {})
    const hasPersonalInfo = baseInfo?.personal_info &&
      Object.keys(baseInfo.personal_info).length > 0

    // Debug logging to help diagnose empty profile issues
    console.log('Base info personal_info:', JSON.stringify(baseInfo?.personal_info || null))
    console.log('Has personal info:', hasPersonalInfo)

    // Check if profile has meaningful data to tailor
    const hasProfileData = baseInfo && (
      Object.keys(baseInfo.personal_info || {}).length > 0 ||
      (baseInfo.work_experience || []).length > 0 ||
      (baseInfo.education || []).length > 0
    )

    // Create original content (untailored)
    // Update professional title to match the job title from job description
    const originalContent = {
      personal_info: hasPersonalInfo ? {
        ...baseInfo.personal_info,
        professional_title: parsedJD.job_title, // Set professional title from job description
      } : {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        professional_title: parsedJD.job_title, // Set professional title from job description
      },
      professional_summary: baseInfo?.professional_summary || '',
      work_experience: baseInfo?.work_experience || [],
      education: baseInfo?.education || [],
      skills: baseInfo?.skills || {
        technical: [],
        soft: [],
        languages: [],
        certifications: [],
      },
      additional_sections: baseInfo?.additional_sections || {
        projects: [],
        volunteer: [],
        awards: [],
        publications: [],
      },
    }

    // AI Tailoring: If profile has data, tailor it to the job description
    let resumeContent = originalContent
    let tailoringApplied = false

    if (hasProfileData) {
      try {
        console.log('Tailoring resume to job description...')
        const tailored = await tailorResume(baseInfo, parsedJD, 'moderate')

        // Merge tailored content with original personal_info and education
        // (we don't tailor personal info or education, only experience, skills, summary, projects)
        resumeContent = {
          personal_info: originalContent.personal_info,
          professional_summary: tailored.professional_summary || originalContent.professional_summary,
          work_experience: tailored.work_experience.length > 0
            ? tailored.work_experience
            : originalContent.work_experience,
          education: originalContent.education, // Education is not tailored
          skills: tailored.skills,
          additional_sections: {
            ...originalContent.additional_sections,
            projects: tailored.additional_sections?.projects || originalContent.additional_sections?.projects,
          },
        }

        tailoringApplied = true
        console.log('Resume tailored successfully')
      } catch (error) {
        console.error('Error tailoring resume:', error)
        console.log('Falling back to original content')
        // Fallback to original content if tailoring fails
        resumeContent = originalContent
      }
    }

    // Create resume record with tailored content
    // Store original content in customization for revert capability
    const { data: newResume, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        job_description_id: savedJobDesc.id,
        title: resumeTitle,
        content: resumeContent,
        template_id: 'classic', // Default template
        customization: {
          original_content: originalContent, // Store for revert capability
          tailoring_applied: tailoringApplied,
        },
      })
      .select()
      .single()

    if (resumeError) {
      console.error('Error creating resume:', resumeError)
      throw new Error('Failed to create resume')
    }

    return NextResponse.json({
      success: true,
      resume_id: newResume.id,
      job_description_id: savedJobDesc.id,
      parsed_job_description: {
        title: parsedJD.job_title,
        company: parsedJD.company,
        skills_extracted: parsedJD.technical_skills.length + parsedJD.soft_skills.length,
      },
      profile_empty: !hasProfileData,
      tailoring_applied: tailoringApplied,
      message: hasProfileData
        ? tailoringApplied
          ? 'Resume created and tailored to job description'
          : 'Resume created successfully'
        : 'Resume created - Add your profile info to populate it',
    })
  } catch (error) {
    console.error('Error generating resume:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate resume',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
