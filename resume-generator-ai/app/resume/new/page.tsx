import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ResumeContent, TemplateCustomization } from '@/lib/types/resume'

export default async function NewResumePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Get user's base information
  const { data: baseInfo } = await supabase
    .from('base_information')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Build resume content from base information
  const content: ResumeContent = {
    personal_info: baseInfo?.personal_info || {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      professional_title: ''
    },
    professional_summary: '',
    work_experience: baseInfo?.work_experience || [],
    education: baseInfo?.education || [],
    skills: baseInfo?.skills || {
      technical: [],
      soft: [],
      languages: [],
      certifications: []
    },
    additional_sections: baseInfo?.additional_sections || {
      projects: [],
      volunteer: [],
      awards: [],
      publications: []
    }
  }

  // Default customization
  const customization: TemplateCustomization = {
    accent_color: '#3B82F6',
    font: 'Roboto',
    font_size: 'medium'
  }

  // Create new resume
  const defaultTitle = `Resume ${new Date().toLocaleDateString()}`

  const { data: resume, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      title: defaultTitle,
      template_id: 'classic',
      content,
      customization
    })
    .select()
    .single()

  if (error || !resume) {
    console.error('Error creating resume:', error)
    redirect('/dashboard')
  }

  // Redirect to editor
  redirect(`/resume/editor/${resume.id}`)
}
