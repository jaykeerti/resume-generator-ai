'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { UserProfileDropdown } from '@/components/ui/UserProfileDropdown'
import { Button } from '@/components/ui/Button'
import { ProfileSummaryCard } from './ProfileSummaryCard'
import { JobDescriptionInput } from './JobDescriptionInput'
import { JobDescriptionModal } from './JobDescriptionModal'
import { useNotifications } from '@/lib/contexts/NotificationContext'

interface JobDescription {
  id: string
  job_title: string
  company_name: string | null
  description_text: string
  parsed_keywords: {
    job_title: string
    company: string | null
    location: string | null
    technical_skills: string[]
    soft_skills: string[]
    qualifications: string[]
    responsibilities: string[]
    technologies: string[]
    keywords: string[]
  }
}

interface Resume {
  id: string
  title: string
  created_at: string
  updated_at: string
  job_description_id: string | null
  job_description?: JobDescription
}

interface UserProfile {
  generation_count: number
  subscription_tier: 'free' | 'pro'
  onboarding_completed: boolean
}

interface BaseInformation {
  personal_info?: any
  work_experience?: any[]
  education?: any[]
  skills?: any
}

interface Props {
  user: User
  profile: UserProfile
  baseInfo: BaseInformation | null
  resumes: Resume[]
}

/**
 * Format date as DD-MON-YY (e.g., 14-NOV-25)
 */
function formatResumeDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const year = date.getFullYear().toString().slice(-2)
  return `${day}-${month}-${year}`
}

export function DashboardContent({ user, profile, baseInfo, resumes: initialResumes }: Props) {
  const { showToast, showModal } = useNotifications()
  const [resumes, setResumes] = useState(initialResumes)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [generationCount, setGenerationCount] = useState(profile.generation_count)
  const [selectedJobDescription, setSelectedJobDescription] = useState<JobDescription | null>(null)
  const [isJobDescModalOpen, setIsJobDescModalOpen] = useState(false)

  const remainingGenerations =
    profile.subscription_tier === 'pro' ? null : Math.max(0, 5 - generationCount)

  // Check if profile is complete
  const isProfileComplete = !!(
    baseInfo?.personal_info?.full_name &&
    baseInfo?.work_experience &&
    baseInfo.work_experience.length > 0 &&
    baseInfo?.education &&
    baseInfo.education.length > 0
  )

  const handleDownload = async (resumeId: string, title: string) => {
    setDownloadingId(resumeId)

    try {
      const response = await fetch(`/api/resume/${resumeId}/export`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()

        if (error.limit_reached) {
          await showModal({
            title: 'Generation Limit Reached',
            message: 'You have reached your limit of 5 resume exports. Upgrade to Pro for unlimited exports.',
            confirmText: 'Got it',
            variant: 'default'
          })
        } else {
          throw new Error(error.message || 'Failed to generate PDF')
        }
        return
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      // Update generation count locally (only for free tier)
      if (profile.subscription_tier === 'free') {
        setGenerationCount(prev => prev + 1)
      }

      // Show success notification
      showToast('success', 'PDF Downloaded Successfully!', 'Check your Downloads folder')
    } catch (error) {
      console.error('Error downloading resume:', error)
      showToast('error', 'Failed to generate PDF', 'Please try again')
    } finally {
      setDownloadingId(null)
    }
  }

  const handleShowJobDescription = (resume: Resume) => {
    if (resume.job_description) {
      setSelectedJobDescription(resume.job_description)
      setIsJobDescModalOpen(true)
    }
  }

  const handleDelete = async (resumeId: string, title: string) => {
    const confirmed = await showModal({
      title: 'Delete Resume?',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive'
    })

    if (!confirmed) {
      return
    }

    setDeletingId(resumeId)

    try {
      const response = await fetch(`/api/resume/${resumeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete resume')
      }

      // Remove from local state
      setResumes(resumes.filter(r => r.id !== resumeId))
      showToast('success', 'Resume deleted', `"${title}" has been removed`)
    } catch (error) {
      console.error('Error deleting resume:', error)
      showToast('error', 'Failed to delete resume', 'Please try again')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Resume Generator AI</h1>
            <UserProfileDropdown user={user} />
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
              <button className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Profile Summary Card */}
        {baseInfo && (
          <div className="mb-8">
            <ProfileSummaryCard profile={baseInfo} />
          </div>
        )}

        {/* Job Description Input */}
        <div className="mb-8">
          <JobDescriptionInput profileComplete={isProfileComplete} />
        </div>

        {/* Import Resume Button */}
        <div className="mb-8">
          <a
            href="/import"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-300 px-6 py-4 text-base font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:bg-zinc-900"
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
            Or import your existing resume
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
                    {formatResumeDate(resume.created_at)}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    {/* Primary Actions Row */}
                    <div className="flex gap-2">
                      <a
                        href={`/resume/editor/${resume.id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          ✏️ Edit
                        </Button>
                      </a>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDownload(resume.id, resume.title)}
                        isLoading={downloadingId === resume.id}
                        disabled={downloadingId === resume.id}
                        className="flex-1"
                      >
                        {downloadingId === resume.id ? 'Generating...' : '📥 Download PDF'}
                      </Button>
                    </div>

                    {/* Secondary Actions Row */}
                    <div className="flex gap-2">
                      {resume.job_description && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleShowJobDescription(resume)}
                          title="View Job Description"
                          className="flex-1"
                        >
                          📄 Job Info
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(resume.id, resume.title)}
                        isLoading={deletingId === resume.id}
                        disabled={deletingId === resume.id}
                        className={resume.job_description ? 'flex-1' : 'w-full'}
                      >
                        {deletingId === resume.id ? 'Deleting...' : '🗑️ Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Job Description Modal */}
      <JobDescriptionModal
        jobDescription={selectedJobDescription}
        isOpen={isJobDescModalOpen}
        onClose={() => setIsJobDescModalOpen(false)}
      />
    </div>
  )
}
