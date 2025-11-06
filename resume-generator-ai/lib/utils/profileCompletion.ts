import type { OnboardingData } from '@/lib/types/onboarding'

export interface SectionCompletion {
  personal: number
  experience: number
  education: number
  skills: number
  overall: number
}

export function calculateProfileCompletion(baseInfo: {
  personal_info: OnboardingData['personal_info']
  work_experience: OnboardingData['work_experience']
  education: OnboardingData['education']
  skills: OnboardingData['skills']
}): SectionCompletion {
  // Personal Info Completion (5 key fields)
  let personalScore = 0
  const personalFields = [
    baseInfo.personal_info?.full_name,
    baseInfo.personal_info?.professional_title,
    baseInfo.personal_info?.email,
    baseInfo.personal_info?.phone,
    baseInfo.personal_info?.location,
  ]
  personalScore = (personalFields.filter(Boolean).length / 5) * 100

  // Experience Completion
  let experienceScore = 0
  if (baseInfo.work_experience && baseInfo.work_experience.length > 0) {
    // At least 1 job = 50%
    experienceScore = 50

    // Check if at least one has responsibilities
    const hasRichExperience = baseInfo.work_experience.some(
      exp => exp.responsibilities && exp.responsibilities.length > 0
    )
    if (hasRichExperience) {
      experienceScore = 100
    }
  }

  // Education Completion
  let educationScore = 0
  if (baseInfo.education && baseInfo.education.length > 0) {
    educationScore = 100
  }

  // Skills Completion
  let skillsScore = 0
  const totalSkills =
    (baseInfo.skills?.technical?.length || 0) +
    (baseInfo.skills?.soft?.length || 0) +
    (baseInfo.skills?.languages?.length || 0) +
    (baseInfo.skills?.certifications?.length || 0)

  if (totalSkills >= 5) {
    skillsScore = 100
  } else if (totalSkills > 0) {
    skillsScore = (totalSkills / 5) * 100
  }

  // Overall Completion (average of all sections)
  const overall = Math.round(
    (personalScore + experienceScore + educationScore + skillsScore) / 4
  )

  return {
    personal: Math.round(personalScore),
    experience: Math.round(experienceScore),
    education: Math.round(educationScore),
    skills: Math.round(skillsScore),
    overall,
  }
}

export function getCompletionColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500'
  if (percentage >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getCompletionTextColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600 dark:text-green-400'
  if (percentage >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}
