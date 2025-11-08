'use client'

import React from 'react'
import type { ResumePersonalInfo } from '@/lib/types/resume'
import { FormInput } from '@/components/ui'

interface PersonalInfoEditorProps {
  personalInfo: ResumePersonalInfo
  onChange: (personalInfo: ResumePersonalInfo) => void
}

export function PersonalInfoEditor({ personalInfo, onChange }: PersonalInfoEditorProps) {
  const handleChange = (field: keyof ResumePersonalInfo, value: string) => {
    onChange({ ...personalInfo, [field]: value })
  }

  return (
    <div className="space-y-4">
      <FormInput
        id="full_name"
        label="Full Name"
        type="text"
        value={personalInfo.full_name}
        onChange={(e) => handleChange('full_name', e.target.value)}
        placeholder="John Doe"
        required
      />

      <FormInput
        id="professional_title"
        label="Professional Title"
        type="text"
        value={personalInfo.professional_title}
        onChange={(e) => handleChange('professional_title', e.target.value)}
        placeholder="Senior Software Engineer"
        required
      />

      <FormInput
        id="email"
        label="Email"
        type="email"
        value={personalInfo.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="john@example.com"
        required
      />

      <FormInput
        id="phone"
        label="Phone"
        type="tel"
        value={personalInfo.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        placeholder="(123) 456-7890"
        required
      />

      <FormInput
        id="location"
        label="Location"
        type="text"
        value={personalInfo.location}
        onChange={(e) => handleChange('location', e.target.value)}
        placeholder="San Francisco, CA"
        required
      />

      <FormInput
        id="linkedin_url"
        label="LinkedIn URL"
        type="url"
        value={personalInfo.linkedin_url || ''}
        onChange={(e) => handleChange('linkedin_url', e.target.value)}
        placeholder="https://linkedin.com/in/johndoe"
      />

      <FormInput
        id="portfolio_url"
        label="Portfolio / Website URL"
        type="url"
        value={personalInfo.portfolio_url || ''}
        onChange={(e) => handleChange('portfolio_url', e.target.value)}
        placeholder="https://johndoe.com"
      />
    </div>
  )
}
