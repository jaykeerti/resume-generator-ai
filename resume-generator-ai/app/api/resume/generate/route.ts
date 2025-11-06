import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Auto-save job description
    const { data: savedJobDesc, error: jobDescError } = await supabase
      .from('job_descriptions')
      .insert({
        user_id: user.id,
        description_text: job_description.trim(),
        parsed_keywords: {}, // TODO: Parse with OpenAI in future iteration
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
    // Extract job title from description (simple approach)
    const jobTitleMatch = job_description.match(/(?:position|role|job title):\s*([^\n]+)/i)
    const extractedTitle = jobTitleMatch ? jobTitleMatch[1].trim() : 'Untitled Resume'
    const resumeTitle = `Resume for ${extractedTitle}`.substring(0, 100)

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
        styling: {}, // Default styling
      })
      .select()
      .single()

    if (resumeError) {
      console.error('Error creating resume:', resumeError)
      throw new Error('Failed to create resume')
    }

    // TODO: In future iteration, use OpenAI to tailor resume sections
    // based on job description keywords

    return NextResponse.json({
      success: true,
      resume_id: newResume.id,
      job_description_id: savedJobDesc.id,
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
