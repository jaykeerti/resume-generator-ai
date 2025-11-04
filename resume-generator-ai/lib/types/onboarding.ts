export interface PersonalInfo {
  full_name: string
  email: string
  phone: string
  location: string
  linkedin_url?: string
  portfolio_url?: string
  professional_title: string
}

export interface WorkExperience {
  company: string
  job_title: string
  start_date: string
  end_date?: string
  is_current: boolean
  location: string
  responsibilities: string[]
}

export interface Education {
  institution: string
  degree_type: string
  field_of_study: string
  graduation_date: string
  gpa?: string
  coursework?: string
}

export interface Skills {
  technical: string[]
  soft: string[]
  languages: { name: string; proficiency: string }[]
  certifications: { name: string; org: string; date: string }[]
}

export interface Project {
  title: string
  description: string
  link?: string
  technologies: string[]
}

export interface AdditionalSections {
  projects: Project[]
  volunteer: string[]
  awards: string[]
  publications: string[]
}

export interface OnboardingData {
  personal_info: PersonalInfo
  work_experience: WorkExperience[]
  education: Education[]
  skills: Skills
  additional_sections: AdditionalSections
}
