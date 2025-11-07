import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseJobDescription } from '@/lib/services/jobDescriptionParser'

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
    const { data: baseInfo } = await supabase
      .from('base_information')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Create a new resume with basic content
    // Use parsed job title for resume title
    const resumeTitle = parsedJD.job_title && parsedJD.job_title !== 'Position from Job Description'
      ? `Resume for ${parsedJD.job_title}`.substring(0, 100)
      : 'New Resume'

    // Create resume content from base information
    const resumeContent = {
      personal_info: baseInfo?.personal_info || {},
      professional_summary: baseInfo?.professional_summary || '',
      work_experience: baseInfo?.work_experience || [],
      education: baseInfo?.education || [],
      skills: baseInfo?.skills || {},
      projects: baseInfo?.projects || [],
      certifications: baseInfo?.certifications || [],
      volunteer_work: baseInfo?.volunteer_work || [],
    }

    // Create resume record
    const { data: newResume, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        job_description_id: savedJobDesc.id,
        title: resumeTitle,
        content: resumeContent,
        template_id: 'classic', // Default template
        customization: {}, // Default customization (accent_color, font, font_size)
      })
      .select()
      .single()

    if (resumeError) {
      console.error('Error creating resume:', resumeError)
      throw new Error('Failed to create resume')
    }

    // Note: Resume tailoring based on JD will be implemented in next iteration
    // For now, we create base resume with user's profile data

    return NextResponse.json({
      success: true,
      resume_id: newResume.id,
      job_description_id: savedJobDesc.id,
      parsed_job_description: {
        title: parsedJD.job_title,
        company: parsedJD.company,
        skills_extracted: parsedJD.technical_skills.length + parsedJD.soft_skills.length,
      },
      message: 'Resume created successfully',
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
