'use client'

import { useState } from 'react'
import type { Education } from '@/lib/types/onboarding'

interface Props {
  data: Education[]
}

export function EducationEditor({ data }: Props) {
  const [education, setEducation] = useState<Education[]>(data)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile/education', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(education),
      })

      if (!response.ok) throw new Error('Failed to save')
      alert('Changes saved successfully!')
    } catch {
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      setEducation(education.filter((_, i) => i !== index))
    }
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    setEducation(updated)
  }

  const addNew = () => {
    setEducation([
      ...education,
      {
        institution: '',
        degree_type: '',
        field_of_study: '',
        graduation_date: '',
        gpa: '',
        coursework: '',
      },
    ])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Education</h2>
        <div className="flex gap-2">
          <button
            onClick={addNew}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            + Add Education
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">
                  {edu.degree_type} {edu.field_of_study && `in ${edu.field_of_study}`}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{edu.institution}</p>
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Degree Type</label>
                <input
                  type="text"
                  value={edu.degree_type}
                  onChange={(e) => updateEducation(index, 'degree_type', e.target.value)}
                  placeholder="Bachelor's, Master's, etc."
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Field of Study</label>
                <input
                  type="text"
                  value={edu.field_of_study}
                  onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                  placeholder="Computer Science"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Graduation Date</label>
                <input
                  type="month"
                  value={edu.graduation_date}
                  onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">GPA (optional)</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  placeholder="3.8"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <p className="text-center text-sm text-zinc-500">
            No education added yet. Click &quot;Add Education&quot; to get started.
          </p>
        )}
      </div>
    </div>
  )
}
