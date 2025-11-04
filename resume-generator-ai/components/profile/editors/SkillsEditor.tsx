'use client'

import { useState } from 'react'
import type { Skills } from '@/lib/types/onboarding'

interface Props {
  data: Skills
}

export function SkillsEditor({ data }: Props) {
  const [skills, setSkills] = useState<Skills>(data || { technical: [], soft: [] })
  const [techInput, setTechInput] = useState('')
  const [softInput, setSoftInput] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile/skills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills),
      })

      if (!response.ok) throw new Error('Failed to save')
      alert('Changes saved successfully!')
    } catch {
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const addTechnical = () => {
    if (techInput.trim()) {
      setSkills({
        ...skills,
        technical: [...skills.technical, techInput.trim()],
      })
      setTechInput('')
    }
  }

  const addSoft = () => {
    if (softInput.trim()) {
      setSkills({
        ...skills,
        soft: [...skills.soft, softInput.trim()],
      })
      setSoftInput('')
    }
  }

  const removeTechnical = (index: number) => {
    setSkills({
      ...skills,
      technical: skills.technical.filter((_, i) => i !== index),
    })
  }

  const removeSoft = (index: number) => {
    setSkills({
      ...skills,
      soft: skills.soft.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Skills</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Technical Skills */}
        <div>
          <label className="block text-sm font-medium">Technical Skills</label>
          <p className="text-xs text-zinc-500">Programming languages, frameworks, tools, etc.</p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnical())}
              placeholder="e.g., JavaScript, React, Node.js"
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              onClick={addTechnical}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-50 dark:text-zinc-900"
            >
              Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.technical?.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
              >
                {skill}
                <button
                  onClick={() => removeTechnical(index)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <label className="block text-sm font-medium">Soft Skills</label>
          <p className="text-xs text-zinc-500">Communication, leadership, teamwork, etc.</p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={softInput}
              onChange={(e) => setSoftInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSoft())}
              placeholder="e.g., Communication, Leadership"
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              onClick={addSoft}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-50 dark:text-zinc-900"
            >
              Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.soft?.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
              >
                {skill}
                <button
                  onClick={() => removeSoft(index)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
