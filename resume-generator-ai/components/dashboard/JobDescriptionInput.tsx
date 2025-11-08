'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { Button, FormTextarea } from '@/components/ui'

interface JobDescriptionInputProps {
  profileComplete: boolean
}

export function JobDescriptionInput({ profileComplete }: JobDescriptionInputProps) {
  const router = useRouter()
  const { showToast } = useNotifications()
  const [jobDescription, setJobDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      showToast('warning', 'Job description required', 'Please paste a job description to continue')
      return
    }

    setIsGenerating(true)

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

      // Show appropriate message based on profile status
      if (data.profile_empty) {
        // Profile is empty - show warning toast with instructions
        showToast('warning', 'Resume Created (Empty)', 'Fill your profile to populate the resume. Click Edit Profile on the dashboard.')
        // Longer delay to read the message
        setTimeout(() => {
          router.push(`/resume/editor/${data.resume_id}`)
        }, 3000)
      } else if (data.parsed_job_description) {
        // Profile has data - show success with parsed info
        const { title, company, skills_extracted } = data.parsed_job_description
        const message = company
          ? `${title} at ${company} • ${skills_extracted} skills identified`
          : `${title} • ${skills_extracted} skills identified`
        showToast('success', 'Job Description Analyzed!', message)
        // Redirect to editor after short delay to show toast
        setTimeout(() => {
          router.push(`/resume/editor/${data.resume_id}`)
        }, 1500)
      }
    } catch (err) {
      console.error('Generation error:', err)
      showToast('error', 'Failed to generate resume', err instanceof Error ? err.message : 'Please try again')
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
              Paste a job description or job posting URL - AI will analyze it
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <FormTextarea
              id="job-description"
              label="Job Description"
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description text or URL from job boards (LinkedIn, Indeed, company careers page, etc.)"
              disabled={isGenerating}
              maxLength={10000}
              showCount={true}
              helperText={charCount > 5000 ? "Very long description - consider shortening for better results" : undefined}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription.trim()}
            variant="primary"
            size="lg"
            isLoading={isGenerating}
            className="w-full font-semibold"
          >
            {isGenerating ? 'Generating AI-Tailored Resume...' : '✨ Generate Tailored Resume'}
          </Button>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            AI extracts skills, requirements, and keywords to match your resume to the role
          </p>
        </div>
      </div>
    </div>
  )
}
