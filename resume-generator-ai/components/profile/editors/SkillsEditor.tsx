'use client'

import { useState } from 'react'
import type { Skills } from '@/lib/types/onboarding'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { FormInput, Button, Badge } from '@/components/ui'

interface Props {
  data: Skills
}

export function SkillsEditor({ data }: Props) {
  const { showToast } = useNotifications()
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
      showToast('success', 'Changes saved', 'Skills updated successfully')
    } catch {
      showToast('error', 'Failed to save changes', 'Please try again')
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
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="primary"
          isLoading={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Technical Skills */}
        <div>
          <label className="block text-sm font-medium">Technical Skills</label>
          <p className="text-xs text-gray-500">Programming languages, frameworks, tools, etc.</p>
          <div className="mt-2 flex gap-2">
            <FormInput
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnical())}
              placeholder="e.g., JavaScript, React, Node.js"
              className="flex-1"
            />
            <Button
              onClick={addTechnical}
              variant="primary"
            >
              Add
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.technical?.map((skill, index) => (
              <Badge
                key={index}
                variant="blue"
                onRemove={() => removeTechnical(index)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <label className="block text-sm font-medium">Soft Skills</label>
          <p className="text-xs text-gray-500">Communication, leadership, teamwork, etc.</p>
          <div className="mt-2 flex gap-2">
            <FormInput
              type="text"
              value={softInput}
              onChange={(e) => setSoftInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSoft())}
              placeholder="e.g., Communication, Leadership"
              className="flex-1"
            />
            <Button
              onClick={addSoft}
              variant="primary"
            >
              Add
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.soft?.map((skill, index) => (
              <Badge
                key={index}
                variant="green"
                onRemove={() => removeSoft(index)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
