'use client'

import React, { useState } from 'react'
import type { ResumeSkills } from '@/lib/types/resume'
import { FormInput, Button, Badge } from '@/components/ui'

interface SkillsEditorProps {
  skills: ResumeSkills
  onChange: (skills: ResumeSkills) => void
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [technicalInput, setTechnicalInput] = useState('')
  const [softInput, setSoftInput] = useState('')
  const [languageInput, setLanguageInput] = useState({ name: '', proficiency: '' })
  const [certInput, setCertInput] = useState({ name: '', org: '', date: '' })

  // Safe defaults for all skill arrays
  const safeSkills = {
    technical: skills?.technical || [],
    soft: skills?.soft || [],
    languages: skills?.languages || [],
    certifications: skills?.certifications || []
  }

  const handleAddTechnical = () => {
    if (technicalInput.trim()) {
      onChange({
        ...safeSkills,
        technical: [...safeSkills.technical, technicalInput.trim()]
      })
      setTechnicalInput('')
    }
  }

  const handleRemoveTechnical = (index: number) => {
    onChange({
      ...safeSkills,
      technical: safeSkills.technical.filter((_, i) => i !== index)
    })
  }

  const handleAddSoft = () => {
    if (softInput.trim()) {
      onChange({
        ...safeSkills,
        soft: [...safeSkills.soft, softInput.trim()]
      })
      setSoftInput('')
    }
  }

  const handleRemoveSoft = (index: number) => {
    onChange({
      ...safeSkills,
      soft: safeSkills.soft.filter((_, i) => i !== index)
    })
  }

  const handleAddLanguage = () => {
    if (languageInput.name.trim() && languageInput.proficiency.trim()) {
      onChange({
        ...safeSkills,
        languages: [...safeSkills.languages, { ...languageInput }]
      })
      setLanguageInput({ name: '', proficiency: '' })
    }
  }

  const handleRemoveLanguage = (index: number) => {
    onChange({
      ...safeSkills,
      languages: safeSkills.languages.filter((_, i) => i !== index)
    })
  }

  const handleAddCertification = () => {
    if (certInput.name.trim() && certInput.org.trim() && certInput.date.trim()) {
      onChange({
        ...safeSkills,
        certifications: [...safeSkills.certifications, { ...certInput }]
      })
      setCertInput({ name: '', org: '', date: '' })
    }
  }

  const handleRemoveCertification = (index: number) => {
    onChange({
      ...safeSkills,
      certifications: safeSkills.certifications.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      {/* Technical Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
        <div className="flex gap-2 mb-2">
          <FormInput
            type="text"
            value={technicalInput}
            onChange={(e) => setTechnicalInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnical())}
            placeholder="e.g., JavaScript, Python, React"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddTechnical}
            variant="primary"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {safeSkills.technical.map((skill, index) => (
            <Badge
              key={index}
              variant="blue"
              onRemove={() => handleRemoveTechnical(index)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
        <div className="flex gap-2 mb-2">
          <FormInput
            type="text"
            value={softInput}
            onChange={(e) => setSoftInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSoft())}
            placeholder="e.g., Leadership, Communication, Problem Solving"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddSoft}
            variant="primary"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {safeSkills.soft.map((skill, index) => (
            <Badge
              key={index}
              variant="green"
              onRemove={() => handleRemoveSoft(index)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
        <div className="flex gap-2 mb-2">
          <FormInput
            type="text"
            value={languageInput.name}
            onChange={(e) => setLanguageInput({ ...languageInput, name: e.target.value })}
            placeholder="Language name"
            className="flex-1"
          />
          <select
            value={languageInput.proficiency}
            onChange={(e) => setLanguageInput({ ...languageInput, proficiency: e.target.value })}
            className="px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Proficiency</option>
            <option value="Native">Native</option>
            <option value="Fluent">Fluent</option>
            <option value="Professional">Professional</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Basic">Basic</option>
          </select>
          <Button
            type="button"
            onClick={handleAddLanguage}
            variant="primary"
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {safeSkills.languages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-sm">
                <span className="font-medium">{lang.name}</span> - {lang.proficiency}
              </span>
              <Button
                type="button"
                onClick={() => handleRemoveLanguage(index)}
                variant="ghost"
                size="sm"
              >
                🗑️
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
        <div className="space-y-2 mb-2">
          <FormInput
            type="text"
            value={certInput.name}
            onChange={(e) => setCertInput({ ...certInput, name: e.target.value })}
            placeholder="Certification name"
          />
          <div className="grid grid-cols-2 gap-2">
            <FormInput
              type="text"
              value={certInput.org}
              onChange={(e) => setCertInput({ ...certInput, org: e.target.value })}
              placeholder="Issuing organization"
            />
            <FormInput
              type="text"
              value={certInput.date}
              onChange={(e) => setCertInput({ ...certInput, date: e.target.value })}
              placeholder="Date (e.g., 2023)"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddCertification}
            variant="primary"
            className="w-full"
          >
            Add Certification
          </Button>
        </div>
        <div className="space-y-2">
          {safeSkills.certifications.map((cert, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-sm">
                <p className="font-medium">{cert.name}</p>
                <p className="text-gray-600">
                  {cert.org} • {cert.date}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => handleRemoveCertification(index)}
                variant="ghost"
                size="sm"
              >
                🗑️
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
