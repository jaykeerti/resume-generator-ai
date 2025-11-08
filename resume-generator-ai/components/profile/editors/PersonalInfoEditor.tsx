'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { PersonalInfo } from '@/lib/types/onboarding'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { FormInput, Button } from '@/components/ui'

interface Props {
  data: PersonalInfo
}

export function PersonalInfoEditor({ data }: Props) {
  const router = useRouter()
  const { showToast } = useNotifications()
  const [formData, setFormData] = useState<PersonalInfo>(data)
  const [saving, setSaving] = useState(false)

  // Sync formData with incoming data prop (important for tab switching)
  useEffect(() => {
    setFormData(data)
  }, [data])

  const updateField = (field: keyof PersonalInfo, value: string) => {
    setFormData({ ...formData, [field]: value })
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

      showToast('success', 'Changes saved', 'Personal information updated successfully')

      // Refresh to get updated data
      router.refresh()
    } catch {
      showToast('error', 'Failed to save changes', 'Please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="primary"
          isLoading={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormInput
            label="Full Name"
            type="text"
            value={formData.full_name}
            onChange={(e) => updateField('full_name', e.target.value)}
          />
        </div>

        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
        />

        <FormInput
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />

        <div className="sm:col-span-2">
          <FormInput
            label="Location"
            type="text"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <FormInput
            label="Professional Title"
            type="text"
            value={formData.professional_title}
            onChange={(e) => updateField('professional_title', e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <FormInput
            label="LinkedIn URL"
            type="url"
            value={formData.linkedin_url || ''}
            onChange={(e) => updateField('linkedin_url', e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <FormInput
            label="Portfolio/Website URL"
            type="url"
            value={formData.portfolio_url || ''}
            onChange={(e) => updateField('portfolio_url', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
