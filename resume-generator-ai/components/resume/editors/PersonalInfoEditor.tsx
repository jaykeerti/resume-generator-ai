'use client'

import React from 'react'
import type { ResumePersonalInfo } from '@/lib/types/resume'

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
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          value={personalInfo.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="professional_title" className="block text-sm font-medium text-gray-700 mb-1">
          Professional Title *
        </label>
        <input
          type="text"
          id="professional_title"
          value={personalInfo.professional_title}
          onChange={(e) => handleChange('professional_title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Senior Software Engineer"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={personalInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="john@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone *
        </label>
        <input
          type="tel"
          id="phone"
          value={personalInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="(123) 456-7890"
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          type="text"
          id="location"
          value={personalInfo.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="San Francisco, CA"
          required
        />
      </div>

      <div>
        <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn URL
        </label>
        <input
          type="url"
          id="linkedin_url"
          value={personalInfo.linkedin_url || ''}
          onChange={(e) => handleChange('linkedin_url', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>

      <div>
        <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700 mb-1">
          Portfolio / Website URL
        </label>
        <input
          type="url"
          id="portfolio_url"
          value={personalInfo.portfolio_url || ''}
          onChange={(e) => handleChange('portfolio_url', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://johndoe.com"
        />
      </div>

      <p className="text-xs text-gray-500 mt-4">* Required fields</p>
    </div>
  )
}
