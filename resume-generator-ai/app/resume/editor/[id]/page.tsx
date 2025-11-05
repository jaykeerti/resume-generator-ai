'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Resume } from '@/lib/types/resume'
import { ResumeEditor } from '@/components/resume/ResumeEditor'

interface ResumeEditorPageProps {
  params: Promise<{ id: string }>
}

export default function ResumeEditorPage({ params }: ResumeEditorPageProps) {
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resumeId, setResumeId] = useState<string | null>(null)

  // Unwrap params
  useEffect(() => {
    params.then(p => setResumeId(p.id))
  }, [params])

  // Fetch resume
  useEffect(() => {
    if (!resumeId) return

    async function fetchResume() {
      try {
        const response = await fetch(`/api/resume/${resumeId}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load resume')
        }

        setResume(data.resume)
      } catch (err) {
        console.error('Error loading resume:', err)
        setError(err instanceof Error ? err.message : 'Failed to load resume')
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
  }, [resumeId])

  const handleSave = async (updates: Partial<Resume>) => {
    if (!resumeId) return

    const response = await fetch(`/api/resume/${resumeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to save resume')
    }

    // Update local state with saved data
    setResume(data.resume)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Resume</h1>
          <p className="text-gray-600 mb-6">{error || 'Resume not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <ResumeEditor resume={resume} onSave={handleSave} />
}
