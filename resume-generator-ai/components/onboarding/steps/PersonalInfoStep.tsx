'use client'

import { useState } from 'react'
import type { OnboardingData, PersonalInfo } from '@/lib/types/onboarding'

interface Props {
  data: Partial<OnboardingData>
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  isFirst: boolean
  isLast: boolean
}

export function PersonalInfoStep({ data, onNext }: Props) {
  const [formData, setFormData] = useState<PersonalInfo>(
    data.personal_info || {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin_url: '',
      portfolio_url: '',
      professional_title: '',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ personal_info: formData })
  }

  const updateField = (field: keyof PersonalInfo, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Let&apos;s start with your basic contact information
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="full_name" className="block text-sm font-medium">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            required
            value={formData.full_name}
            onChange={(e) => updateField('full_name', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium">
            Location *
          </label>
          <input
            type="text"
            id="location"
            required
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="professional_title" className="block text-sm font-medium">
            Professional Title *
          </label>
          <input
            type="text"
            id="professional_title"
            required
            value={formData.professional_title}
            onChange={(e) => updateField('professional_title', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="Senior Software Engineer"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="linkedin_url" className="block text-sm font-medium">
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin_url"
            value={formData.linkedin_url}
            onChange={(e) => updateField('linkedin_url', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="portfolio_url" className="block text-sm font-medium">
            Portfolio/Website URL
          </label>
          <input
            type="url"
            id="portfolio_url"
            value={formData.portfolio_url}
            onChange={(e) => updateField('portfolio_url', e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            placeholder="https://johndoe.com"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Next
        </button>
      </div>
    </form>
  )
}
