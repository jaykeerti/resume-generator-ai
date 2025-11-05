'use client'

import React, { useState } from 'react'
import type { ResumeEducation } from '@/lib/types/resume'

interface EducationEditorProps {
  education: ResumeEducation[]
  onChange: (education: ResumeEducation[]) => void
}

export function EducationEditor({ education, onChange }: EducationEditorProps) {
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

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
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
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Education
        </button>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
        <input
          type="text"
          value={education.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="University of California, Berkeley"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type *</label>
          <input
            type="text"
            value={education.degree_type}
            onChange={(e) => handleChange('degree_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bachelor of Science"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study *</label>
          <input
            type="text"
            value={education.field_of_study}
            onChange={(e) => handleChange('field_of_study', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Computer Science"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date *</label>
          <input
            type="text"
            value={education.graduation_date}
            onChange={(e) => handleChange('graduation_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="May 2020"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GPA (optional)</label>
          <input
            type="text"
            value={education.gpa || ''}
            onChange={(e) => handleChange('gpa', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3.8"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Coursework (optional)</label>
        <textarea
          value={education.coursework || ''}
          onChange={(e) => handleChange('coursework', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Data Structures, Algorithms, Machine Learning, Database Systems"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  )
}
