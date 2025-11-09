/**
 * Type definitions for parsed resume data
 * Matches the FastAPI backend Pydantic schemas
 */

export interface PersonalInfo {
  full_name: string | null
  email: string | null
  phone: string | null
  location: string | null
  linkedin: string | null
  portfolio: string | null
  github: string | null
}

export interface WorkExperience {
  company: string
  position: string
  location: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  responsibilities: string[]
}

export interface Education {
  institution: string
  degree: string | null
  field_of_study: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  gpa: string | null
  achievements: string[]
}

export interface Project {
  name: string
  description: string
  technologies?: string[]
  url?: string
}

export interface VolunteerWork {
  organization: string
  role: string
  date: string
  description: string
}

export interface StructuredResumeData {
  personal_info: PersonalInfo | null
  professional_summary: string | null
  work_experience: WorkExperience[]
  education: Education[]
  skills: string[]
  certifications: string[]
  projects: Project[]
  languages: string[]
  volunteer_work: VolunteerWork[]
}

export interface ParsedResumeResponse {
  success: boolean
  filename: string
  raw_text: string
  structured_data: StructuredResumeData | null
  message: string
}

// Resume Editor Types
export type TemplateId = 'classic' | 'modern' | 'minimal'

export type FontFamily = 'Roboto' | 'Open Sans' | 'Lato'
export type FontSize = 'small' | 'medium' | 'large'

export interface TemplateCustomization {
  accent_color: string // hex color, e.g., "#3B82F6"
  font: FontFamily
  font_size: FontSize
  // AI Tailoring fields (optional for backward compatibility)
  tailoring_applied?: boolean
  original_content?: ResumeContent
}

export interface ResumePersonalInfo {
  full_name: string
  email: string
  phone: string
  location: string
  linkedin_url?: string
  portfolio_url?: string
  professional_title: string
}

export interface ResumeWorkExperience {
  company: string
  job_title: string
  start_date: string
  end_date?: string
  is_current: boolean
  location: string
  responsibilities: string[]
}

export interface ResumeEducation {
  institution: string
  degree_type: string
  field_of_study: string
  graduation_date: string
  gpa?: string
  coursework?: string
}

export interface ResumeSkills {
  technical: string[]
  soft: string[]
  languages: { name: string; proficiency: string }[]
  certifications: { name: string; org: string; date: string }[]
}

export interface ResumeProject {
  title: string
  description: string
  link?: string
  technologies: string[]
}

export interface ResumeAdditionalSections {
  projects: ResumeProject[]
  volunteer: string[]
  awards: string[]
  publications: string[]
}

export interface ResumeContent {
  personal_info: ResumePersonalInfo
  professional_summary?: string
  work_experience: ResumeWorkExperience[]
  education: ResumeEducation[]
  skills: ResumeSkills
  additional_sections: ResumeAdditionalSections
}

export interface Resume {
  id: string
  user_id: string
  job_description_id?: string
  title: string
  template_id: TemplateId
  content: ResumeContent
  customization: TemplateCustomization
  created_at: string
  updated_at: string
}

export interface TemplateConfig {
  id: TemplateId
  name: string
  description: string
  thumbnail: string // path to preview image
  defaultCustomization: TemplateCustomization
}
