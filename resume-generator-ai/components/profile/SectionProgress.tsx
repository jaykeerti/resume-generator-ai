'use client'

import { getCompletionColor, getCompletionTextColor } from '@/lib/utils/profileCompletion'

interface SectionProgressProps {
  percentage: number
  sectionName: string
}

export function SectionProgress({ percentage, sectionName }: SectionProgressProps) {
  const colorClass = getCompletionColor(percentage)
  const textColorClass = getCompletionTextColor(percentage)

  return (
    <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {sectionName} Section
        </span>
        <span className={`text-sm font-semibold ${textColorClass}`}>
          {percentage}% {percentage === 100 && '✓'}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage < 100 && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {percentage === 0
            ? 'Add information to this section'
            : 'Add more details to improve AI results'}
        </p>
      )}
    </div>
  )
}
