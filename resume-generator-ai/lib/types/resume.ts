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
