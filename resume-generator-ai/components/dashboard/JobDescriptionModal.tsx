'use client'

import { useEffect } from 'react'

interface JobDescription {
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

interface JobDescriptionModalProps {
  jobDescription: JobDescription | null
  isOpen: boolean
  onClose: () => void
}

export function JobDescriptionModal({ jobDescription, isOpen, onClose }: JobDescriptionModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !jobDescription) return null

  const parsed = jobDescription.parsed_keywords

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {parsed.job_title}
              </h2>
              {parsed.company && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {parsed.company}
                  {parsed.location && ` • ${parsed.location}`}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 px-6 py-6">
          {/* Technical Skills */}
          {parsed.technical_skills && parsed.technical_skills.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsed.technical_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {parsed.soft_skills && parsed.soft_skills.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsed.soft_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {parsed.technologies && parsed.technologies.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsed.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {parsed.responsibilities && parsed.responsibilities.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Key Responsibilities
              </h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {parsed.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {parsed.qualifications && parsed.qualifications.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Qualifications
              </h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {parsed.qualifications.map((qual, index) => (
                  <li key={index}>{qual}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Description */}
          {jobDescription.description_text && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Full Job Description
              </h3>
              <div className="rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <p className="whitespace-pre-wrap">{jobDescription.description_text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
