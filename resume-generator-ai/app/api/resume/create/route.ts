import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ResumeContent, TemplateCustomization } from '@/lib/types/resume'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title } = await request.json()

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Get user's base information to populate initial resume content
    const { data: baseInfo, error: baseInfoError } = await supabase
      .from('base_information')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (baseInfoError || !baseInfo) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Build resume content from base information
    const content: ResumeContent = {
      personal_info: baseInfo.personal_info || {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        professional_title: ''
      },
      professional_summary: '',
      work_experience: baseInfo.work_experience || [],
      education: baseInfo.education || [],
      skills: baseInfo.skills || {
        technical: [],
        soft: [],
        languages: [],
        certifications: []
      },
      additional_sections: baseInfo.additional_sections || {
        projects: [],
        volunteer: [],
        awards: [],
        publications: []
      }
    }

    // Default customization
    const customization: TemplateCustomization = {
      accent_color: '#3B82F6', // Blue
      font: 'Roboto',
      font_size: 'medium'
    }

    // Create new resume
    const { data: resume, error: createError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        title: title.trim(),
        template_id: 'classic',
        content,
        customization
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating resume:', createError)
      throw createError
    }

    return NextResponse.json({ success: true, resume }, { status: 201 })
  } catch (error) {
    console.error('Error in resume creation:', error)
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 })
  }
}
