'use client'

import { useState } from 'react'
import type { PersonalInfo } from '@/lib/types/onboarding'

interface Props {
  data: PersonalInfo
}

export function PersonalInfoEditor({ data }: Props) {
  const [formData, setFormData] = useState<PersonalInfo>(data)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateField = (field: keyof PersonalInfo, value: string) => {
    setFormData({ ...formData, [field]: value })
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile/personal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => updateField('full_name', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Professional Title</label>
          <input
            type="text"
            value={formData.professional_title}
            onChange={(e) => updateField('professional_title', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">LinkedIn URL</label>
          <input
            type="url"
            value={formData.linkedin_url || ''}
            onChange={(e) => updateField('linkedin_url', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Portfolio/Website URL</label>
          <input
            type="url"
            value={formData.portfolio_url || ''}
            onChange={(e) => updateField('portfolio_url', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>
    </div>
  )
}
