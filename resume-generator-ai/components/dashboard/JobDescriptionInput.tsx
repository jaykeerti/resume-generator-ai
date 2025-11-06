'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface JobDescriptionInputProps {
  profileComplete: boolean
}

export function JobDescriptionInput({ profileComplete }: JobDescriptionInputProps) {
  const router = useRouter()
  const [jobDescription, setJobDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Save job description and generate resume
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to generate resume')
      }

      const data = await response.json()

      // Redirect to editor
      router.push(`/resume/editor/${data.resume_id}`)
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate resume')
      setIsGenerating(false)
    }
  }

  const charCount = jobDescription.length

  return (
    <div className="space-y-4">
      {/* Warning Banner if Profile Incomplete */}
      {!profileComplete && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Profile Incomplete
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                Complete your profile for better AI-tailored results.{' '}
                <a
                  href="/profile"
                  className="font-semibold underline hover:no-underline"
                >
                  Edit Profile →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Create AI-Tailored Resume
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Paste a job description and we'll tailor your resume to match it
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="job-description" className="sr-only">
              Job Description
            </label>
            <textarea
              id="job-description"
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here... (job title, requirements, responsibilities, etc.)"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              disabled={isGenerating}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {charCount > 0 && `${charCount} characters`}
              </p>
              {charCount > 5000 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Very long description - consider shortening for better results
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
            className="w-full rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating AI-Tailored Resume...
              </span>
            ) : (
              '✨ Generate Tailored Resume'
            )}
          </button>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Our AI will analyze the job requirements and tailor your resume accordingly
          </p>
        </div>
      </div>
    </div>
  )
}
