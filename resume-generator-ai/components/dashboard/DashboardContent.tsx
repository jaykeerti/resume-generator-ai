'use client'

import { signOut } from '@/lib/auth/actions'
import type { User } from '@supabase/supabase-js'

interface Resume {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface UserProfile {
  generation_count: number
  subscription_tier: 'free' | 'pro'
  onboarding_completed: boolean
}

interface Props {
  user: User
  profile: UserProfile
  resumes: Resume[]
}

export function DashboardContent({ user, profile, resumes }: Props) {
  const remainingGenerations =
    profile.subscription_tier === 'pro' ? null : Math.max(0, 5 - profile.generation_count)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Resume Generator AI</h1>
            <div className="flex items-center gap-4">
              <a
                href="/profile"
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Edit Profile
              </a>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tier Status */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {profile.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {profile.subscription_tier === 'pro' ? (
                  'Unlimited resume generations'
                ) : remainingGenerations !== null ? (
                  <>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {remainingGenerations} / 5
                    </span>{' '}
                    resume generations remaining
                  </>
                ) : null}
              </p>
            </div>
            {profile.subscription_tier === 'free' && (
              <button className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Create Resume CTA */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <a
            href="/resume/new"
            className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Resume
          </a>
          <a
            href="/import"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-900 px-6 py-4 text-lg font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Import Existing Resume
          </a>
        </div>

        {/* Resumes List */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Your Resumes</h2>
          {resumes.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                No resumes yet. Create your first tailored resume!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-lg border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="font-semibold">{resume.title}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Created {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`/resume/editor/${resume.id}`}
                      className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => {
                        if (confirm('Export to PDF functionality coming soon!')) {
                          // PDF export will be implemented in Phase 6
                        }
                      }}
                      className="flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
