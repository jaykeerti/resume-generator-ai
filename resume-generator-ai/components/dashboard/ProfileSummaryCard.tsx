'use client'

import Link from 'next/link'

interface ProfileData {
  personal_info?: {
    full_name?: string
    professional_title?: string
  }
  work_experience?: any[]
  education?: any[]
  skills?: {
    technical?: any[]
    soft?: any[]
    languages?: any[]
    certifications?: any[]
  }
}

interface ProfileSummaryCardProps {
  profile: ProfileData
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  // Calculate profile completion
  const calculateCompletion = () => {
    let completed = 0
    let total = 6

    if (profile.personal_info?.full_name) completed++
    if (profile.personal_info?.professional_title) completed++
    if (profile.work_experience && profile.work_experience.length > 0) completed++
    if (profile.education && profile.education.length > 0) completed++

    const totalSkills =
      (profile.skills?.technical?.length || 0) +
      (profile.skills?.soft?.length || 0) +
      (profile.skills?.languages?.length || 0) +
      (profile.skills?.certifications?.length || 0)

    if (totalSkills > 0) completed++

    // Check if at least 2 work experiences have content
    const hasRichExperience = profile.work_experience &&
      profile.work_experience.filter(exp =>
        exp.responsibilities && exp.responsibilities.length > 0
      ).length >= 1
    if (hasRichExperience) completed++

    return Math.round((completed / total) * 100)
  }

  const completionPercentage = calculateCompletion()
  const isIncomplete = completionPercentage < 50

  // Get stats
  const experienceCount = profile.work_experience?.length || 0
  const educationCount = profile.education?.length || 0
  const skillsCount =
    (profile.skills?.technical?.length || 0) +
    (profile.skills?.soft?.length || 0)

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Your Profile
            </h3>
            {isIncomplete && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                Incomplete
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {profile.personal_info?.full_name || 'No name set'}
            {profile.personal_info?.professional_title && ` • ${profile.personal_info.professional_title}`}
          </p>
        </div>

        <Link
          href="/profile"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Edit Profile
        </Link>
      </div>

      {/* Profile Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <StatItem
          label="Experience"
          value={experienceCount}
          icon="💼"
        />
        <StatItem
          label="Education"
          value={educationCount}
          icon="🎓"
        />
        <StatItem
          label="Skills"
          value={skillsCount}
          icon="⚡"
        />
      </div>

      {/* Completion Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Profile Completion
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {completionPercentage}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={`h-full transition-all duration-500 ${
              completionPercentage < 50
                ? 'bg-amber-500'
                : completionPercentage < 80
                ? 'bg-blue-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        {isIncomplete && (
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
            Complete your profile to create better resumes
          </p>
        )}
      </div>
    </div>
  )
}

function StatItem({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{label}</p>
        </div>
      </div>
    </div>
  )
}
