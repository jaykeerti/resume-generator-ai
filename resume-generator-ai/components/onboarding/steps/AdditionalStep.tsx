'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OnboardingData } from '@/lib/types/onboarding'
import { createClient } from '@/lib/supabase/client'

interface Props {
  data: Partial<OnboardingData>
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  isFirst: boolean
  isLast: boolean
}

export function AdditionalStep({ data, onBack }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const additional = data.additional_sections || {
    projects: [],
    volunteer: [],
    awards: [],
    publications: [],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Save base information
      const { error: dbError } = await supabase
        .from('base_information')
        .insert({
          user_id: user.id,
          personal_info: data.personal_info,
          work_experience: data.work_experience,
          education: data.education,
          skills: data.skills,
          additional_sections: additional,
        })

      if (dbError) throw dbError

      // Mark onboarding as complete
      await supabase
        .from('users_profile')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Additional Information (Optional)</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add projects, volunteer work, awards, or publications to strengthen your resume
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You can skip this step for now and add additional sections later from your dashboard.
        </p>
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="rounded-lg border border-zinc-300 px-6 py-2 font-medium transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? 'Saving...' : 'Complete Onboarding'}
        </button>
      </div>
    </form>
  )
}
