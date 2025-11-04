'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/upload/FileUpload'
import { ParsedDataDisplay } from '@/components/upload/ParsedDataDisplay'
import type { ParsedResumeResponse, StructuredResumeData } from '@/lib/types/resume'

export default function ImportPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<StructuredResumeData | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleFileSelect = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('structure_with_ai', 'true')

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to parse resume')
      }

      const data: ParsedResumeResponse = await response.json()

      if (!data.success || !data.structured_data) {
        throw new Error('Failed to extract structured data from resume')
      }

      setParsedData(data.structured_data)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to parse resume')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    if (!parsedData) return

    setIsSaving(true)
    setError(null)

    try {
      // Save personal info
      if (parsedData.personal_info) {
        const personalResponse = await fetch('/api/profile/personal', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: parsedData.personal_info.full_name,
            email: parsedData.personal_info.email,
            phone: parsedData.personal_info.phone,
            location: parsedData.personal_info.location,
            linkedin_url: parsedData.personal_info.linkedin,
            portfolio_url: parsedData.personal_info.portfolio,
            github_url: parsedData.personal_info.github,
          }),
        })

        if (!personalResponse.ok) {
          throw new Error('Failed to save personal information')
        }
      }

      // Save work experience
      if (parsedData.work_experience && parsedData.work_experience.length > 0) {
        for (const exp of parsedData.work_experience) {
          await fetch('/api/profile/experience', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              company: exp.company,
              position: exp.position,
              location: exp.location,
              start_date: exp.start_date,
              end_date: exp.end_date,
              description: exp.responsibilities.join('\n'),
            }),
          })
        }
      }

      // Save education
      if (parsedData.education && parsedData.education.length > 0) {
        for (const edu of parsedData.education) {
          await fetch('/api/profile/education', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              institution: edu.institution,
              degree: edu.degree,
              field_of_study: edu.field_of_study,
              location: edu.location,
              start_date: edu.start_date,
              end_date: edu.end_date,
              gpa: edu.gpa,
              achievements: edu.achievements.join('\n'),
            }),
          })
        }
      }

      // Save skills
      if (parsedData.skills && parsedData.skills.length > 0) {
        await fetch('/api/profile/skills', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skills: parsedData.skills,
          }),
        })
      }

      // Redirect to profile page after successful save
      router.push('/profile?imported=true')
    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save resume data')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Import Resume</h1>
            </div>
            <a
              href="/dashboard"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {!parsedData ? (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Upload Your Existing Resume
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Upload your existing resume in PDF, DOCX, or TXT format. Our AI will automatically
                extract and structure your information, making it easy to update your profile.
              </p>
              <div className="mt-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950">
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  What happens next?
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <li>AI extracts your information from the document</li>
                  <li>Review and verify the extracted data</li>
                  <li>Save to your profile or make edits</li>
                  <li>Use this data for future resume generations</li>
                </ul>
              </div>
            </div>

            {/* Upload Component */}
            <FileUpload
              onFileSelect={handleFileSelect}
              isLoading={isUploading}
              error={error}
            />

            {/* Loading State */}
            {isUploading && (
              <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100"></div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      Processing your resume...
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Resume parsed successfully!
                  </p>
                  <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                    Review the extracted information below and save it to your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Parsed Data Display */}
            <ParsedDataDisplay
              data={parsedData}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>
        )}
      </main>
    </div>
  )
}
