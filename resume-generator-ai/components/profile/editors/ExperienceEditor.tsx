'use client'

import { useState } from 'react'
import type { WorkExperience } from '@/lib/types/onboarding'

interface Props {
  data: WorkExperience[]
}

export function ExperienceEditor({ data }: Props) {
  const [experiences, setExperiences] = useState<WorkExperience[]>(data)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile/experience', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experiences),
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
    if (confirm('Are you sure you want to delete this experience?')) {
      setExperiences(experiences.filter((_, i) => i !== index))
    }
  }

  const handleEdit = (index: number) => {
    setEditingId(editingId === index ? null : index)
  }

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    const updated = [...experiences]
    updated[index] = { ...updated[index], [field]: value }
    setExperiences(updated)
  }

  const addNew = () => {
    setExperiences([
      ...experiences,
      {
        company: '',
        job_title: '',
        start_date: '',
        end_date: '',
        is_current: false,
        location: '',
        responsibilities: [''],
      },
    ])
    setEditingId(experiences.length)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <div className="flex gap-2">
          <button
            onClick={addNew}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            + Add Experience
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
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
          >
            {editingId === index ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="Company"
                    className="rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <input
                    type="text"
                    value={exp.job_title}
                    onChange={(e) => updateExperience(index, 'job_title', e.target.value)}
                    placeholder="Job Title"
                    className="rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <input
                    type="month"
                    value={exp.start_date}
                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                    className="rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <input
                    type="month"
                    value={exp.end_date || ''}
                    disabled={exp.is_current}
                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                    className="rounded-lg border border-zinc-300 px-4 py-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={exp.is_current}
                    onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                    className="mr-2"
                  />
                  Current position
                </label>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                >
                  Done Editing
                </button>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{exp.job_title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {exp.company} • {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {experiences.length === 0 && (
          <p className="text-center text-sm text-zinc-500">
            No work experience added yet. Click &quot;Add Experience&quot; to get started.
          </p>
        )}
      </div>
    </div>
  )
}
