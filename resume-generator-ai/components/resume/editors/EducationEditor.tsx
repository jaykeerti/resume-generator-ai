'use client'

import React, { useState } from 'react'
import type { ResumeEducation } from '@/lib/types/resume'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { FormInput, FormTextarea, Button } from '@/components/ui'

interface EducationEditorProps {
  education: ResumeEducation[]
  onChange: (education: ResumeEducation[]) => void
}

export function EducationEditor({ education, onChange }: EducationEditorProps) {
  const { showModal } = useNotifications()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const emptyEducation: ResumeEducation = {
    institution: '',
    degree_type: '',
    field_of_study: '',
    graduation_date: '',
    gpa: '',
    coursework: ''
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingIndex(null)
  }

  const handleSaveNew = (edu: ResumeEducation) => {
    onChange([...education, edu])
    setIsAdding(false)
  }

  const handleUpdate = (index: number, edu: ResumeEducation) => {
    const updated = [...education]
    updated[index] = edu
    onChange(updated)
    setEditingIndex(null)
  }

  const handleDelete = async (index: number) => {
    const confirmed = await showModal({
      title: 'Delete Education?',
      message: 'Are you sure you want to delete this education entry? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive'
    })

    if (confirmed) {
      onChange(education.filter((_, i) => i !== index))
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updated = [...education]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onChange(updated)
  }

  const handleMoveDown = (index: number) => {
    if (index === education.length - 1) return
    const updated = [...education]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Education</h3>
        <Button
          onClick={handleAdd}
          variant="primary"
          size="sm"
        >
          + Add Education
        </Button>
      </div>

      {education.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No education added yet. Click "Add Education" to get started.
        </div>
      )}

      {education.map((edu, index) => (
        <div key={index}>
          {editingIndex === index ? (
            <EducationForm
              education={edu}
              onSave={(updated) => handleUpdate(index, updated)}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{edu.institution}</h4>
                  <p className="text-sm text-gray-600">
                    {edu.degree_type} {edu.field_of_study && `in ${edu.field_of_study}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {edu.graduation_date}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  {index > 0 && (
                    <button
                      onClick={() => handleMoveUp(index)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  {index < education.length - 1 && (
                    <button
                      onClick={() => handleMoveDown(index)}
                      className="p-1 hover:bg-gray-100 rounded"
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
              {edu.coursework && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Coursework:</span> {edu.coursework}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {isAdding && (
        <EducationForm
          education={emptyEducation}
          onSave={handleSaveNew}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </div>
  )
}

interface EducationFormProps {
  education: ResumeEducation
  onSave: (education: ResumeEducation) => void
  onCancel: () => void
}

function EducationForm({ education: initialEducation, onSave, onCancel }: EducationFormProps) {
  const [education, setEducation] = useState(initialEducation)

  const handleChange = (field: keyof ResumeEducation, value: string) => {
    setEducation({ ...education, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(education)
  }

  return (
    <form onSubmit={handleSubmit} className="border border-blue-300 rounded-lg p-4 bg-blue-50">
      <div className="mb-4">
        <FormInput
          label="Institution"
          type="text"
          value={education.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          placeholder="University of California, Berkeley"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormInput
          label="Degree Type"
          type="text"
          value={education.degree_type}
          onChange={(e) => handleChange('degree_type', e.target.value)}
          placeholder="Bachelor of Science"
          required
        />
        <FormInput
          label="Field of Study"
          type="text"
          value={education.field_of_study}
          onChange={(e) => handleChange('field_of_study', e.target.value)}
          placeholder="Computer Science"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormInput
          label="Graduation Date"
          type="text"
          value={education.graduation_date}
          onChange={(e) => handleChange('graduation_date', e.target.value)}
          placeholder="May 2020"
          required
        />
        <FormInput
          label="GPA (optional)"
          type="text"
          value={education.gpa || ''}
          onChange={(e) => handleChange('gpa', e.target.value)}
          placeholder="3.8"
        />
      </div>

      <div className="mb-4">
        <FormTextarea
          label="Relevant Coursework (optional)"
          value={education.coursework || ''}
          onChange={(e) => handleChange('coursework', e.target.value)}
          rows={3}
          placeholder="Data Structures, Algorithms, Machine Learning, Database Systems"
        />
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
