'use client'

import React, { useState } from 'react'
import type { ResumeWorkExperience } from '@/lib/types/resume'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { FormInput, RichTextEditor, Button } from '@/components/ui'

interface ExperienceEditorProps {
  experiences: ResumeWorkExperience[]
  onChange: (experiences: ResumeWorkExperience[]) => void
}

export function ExperienceEditor({ experiences, onChange }: ExperienceEditorProps) {
  const { showModal } = useNotifications()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const emptyExperience: ResumeWorkExperience = {
    company: '',
    job_title: '',
    start_date: '',
    end_date: '',
    is_current: false,
    location: '',
    responsibilities: ['']
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingIndex(null)
  }

  const handleSaveNew = (experience: ResumeWorkExperience) => {
    onChange([...experiences, experience])
    setIsAdding(false)
  }

  const handleUpdate = (index: number, experience: ResumeWorkExperience) => {
    const updated = [...experiences]
    updated[index] = experience
    onChange(updated)
    setEditingIndex(null)
  }

  const handleDelete = async (index: number) => {
    const confirmed = await showModal({
      title: 'Delete Work Experience?',
      message: 'Are you sure you want to delete this work experience? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive'
    })

    if (confirmed) {
      onChange(experiences.filter((_, i) => i !== index))
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updated = [...experiences]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onChange(updated)
  }

  const handleMoveDown = (index: number) => {
    if (index === experiences.length - 1) return
    const updated = [...experiences]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Work Experience</h3>
        <Button
          onClick={handleAdd}
          variant="primary"
          size="sm"
        >
          + Add Experience
        </Button>
      </div>

      {experiences.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No work experience added yet. Click "Add Experience" to get started.
        </div>
      )}

      {experiences.map((exp, index) => (
        <div key={index}>
          {editingIndex === index ? (
            <ExperienceForm
              experience={exp}
              onSave={(updated) => handleUpdate(index, updated)}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{exp.job_title}</h4>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  {index > 0 && (
                    <button
                      onClick={() => handleMoveUp(index)}
                      className="p-2 hover:bg-gray-100 rounded border border-gray-300 text-gray-700 font-bold text-lg leading-none"
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  {index < experiences.length - 1 && (
                    <button
                      onClick={() => handleMoveDown(index)}
                      className="p-2 hover:bg-gray-100 rounded border border-gray-300 text-gray-700 font-bold text-lg leading-none"
                      title="Move down"
                    >
                      ↓
                    </button>
                  )}
                  <button
                    onClick={() => setEditingIndex(index)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1 hover:bg-gray-100 rounded text-red-600"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                  {exp.responsibilities.slice(0, 2).map((resp, i) => (
                    <li key={i} className="line-clamp-1">{resp}</li>
                  ))}
                  {exp.responsibilities.length > 2 && (
                    <li className="text-gray-500">+{exp.responsibilities.length - 2} more...</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}

      {isAdding && (
        <ExperienceForm
          experience={emptyExperience}
          onSave={handleSaveNew}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </div>
  )
}

/**
 * Convert array of responsibility strings to HTML bullet list
 */
function responsibilitiesToHtml(responsibilities: string[]): string {
  if (!responsibilities || responsibilities.length === 0) {
    return ''
  }

  // Create bullet list HTML with type safety
  const items = responsibilities
    .filter(r => r && typeof r === 'string' && r.trim() !== '') // Ensure r is a valid string
    .map(r => `<li>${r}</li>`)
    .join('')

  return items ? `<ul>${items}</ul>` : ''
}

/**
 * Extract bullet points from HTML back to array
 * Uses textContent to extract plain text without HTML tags
 */
function htmlToResponsibilities(html: string): string[] {
  if (!html || typeof html !== 'string' || html.trim() === '') {
    return []
  }

  // Parse HTML and extract list items
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const listItems = doc.querySelectorAll('li')

  return Array.from(listItems)
    .map(li => {
      // Use textContent to get plain text without HTML tags
      const content = li.textContent?.trim() || ''
      return content
    })
    .filter(text => text && text !== '')
}

interface ExperienceFormProps {
  experience: ResumeWorkExperience
  onSave: (experience: ResumeWorkExperience) => void
  onCancel: () => void
}

function ExperienceForm({ experience: initialExperience, onSave, onCancel }: ExperienceFormProps) {
  const [experience, setExperience] = useState(initialExperience)
  // Convert responsibilities array to HTML for the editor
  const [responsibilitiesHtml, setResponsibilitiesHtml] = useState(
    responsibilitiesToHtml(initialExperience.responsibilities)
  )

  const handleChange = (field: keyof ResumeWorkExperience, value: any) => {
    setExperience({ ...experience, [field]: value })
  }

  const handleResponsibilitiesChange = (html: string) => {
    setResponsibilitiesHtml(html)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Convert HTML back to array format
    const responsibilities = htmlToResponsibilities(responsibilitiesHtml)
    const cleanedExperience = {
      ...experience,
      responsibilities
    }
    onSave(cleanedExperience)
  }

  return (
    <form onSubmit={handleSubmit} className="border border-blue-300 rounded-lg p-4 bg-blue-50">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormInput
          label="Job Title"
          type="text"
          value={experience.job_title}
          onChange={(e) => handleChange('job_title', e.target.value)}
          required
        />
        <FormInput
          label="Company"
          type="text"
          value={experience.company}
          onChange={(e) => handleChange('company', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormInput
          label="Start Date"
          type="text"
          value={experience.start_date}
          onChange={(e) => handleChange('start_date', e.target.value)}
          placeholder="Jan 2020"
          required
        />
        <FormInput
          label="End Date"
          type="text"
          value={experience.end_date || ''}
          onChange={(e) => handleChange('end_date', e.target.value)}
          placeholder="Dec 2023"
          disabled={experience.is_current}
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={experience.is_current}
            onChange={(e) => {
              handleChange('is_current', e.target.checked)
              if (e.target.checked) {
                handleChange('end_date', '')
              }
            }}
            className="rounded"
          />
          I currently work here
        </label>
      </div>

      <div className="mb-4">
        <FormInput
          label="Location"
          type="text"
          value={experience.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="mb-4">
        <RichTextEditor
          label="Responsibilities & Achievements"
          value={responsibilitiesHtml}
          onChange={handleResponsibilitiesChange}
          placeholder="Use the bullet list button to add your responsibilities and achievements..."
          minHeight="200px"
          showToolbar={true}
          enableLists={true}
        />
        <p className="text-xs text-gray-500 mt-1">
          💡 Tip: Click the bullet list button (•) in the toolbar to create bullet points. Each bullet will be saved separately.
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          Save
        </Button>
      </div>
    </form>
  )
}
