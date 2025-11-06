'use client'

import { getCompletionColor, getCompletionTextColor } from '@/lib/utils/profileCompletion'

interface ProfileProgressBannerProps {
  percentage: number
}

export function ProfileProgressBanner({ percentage }: ProfileProgressBannerProps) {
  const incompleteSections = Math.ceil((100 - percentage) / 25)
  const colorClass = getCompletionColor(percentage)
  const textColorClass = getCompletionTextColor(percentage)

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Profile Completion
        </h2>
        <span className={`text-2xl font-bold ${textColorClass}`}>
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={`h-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Message */}
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {percentage === 100 ? (
          <p className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            Your profile is complete! Ready for AI-tailored resumes.
          </p>
        ) : percentage >= 80 ? (
          <p>
            Almost there! Complete {incompleteSections} more section{incompleteSections > 1 ? 's' : ''} for best results.
          </p>
        ) : percentage >= 50 ? (
          <p>
            Good start! Complete {incompleteSections} more section{incompleteSections > 1 ? 's' : ''} for better AI results.
          </p>
        ) : (
          <p>
            Complete {incompleteSections} more section{incompleteSections > 1 ? 's' : ''} to unlock better AI-tailored resumes.
          </p>
        )}
      </div>
    </div>
  )
}
