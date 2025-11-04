'use client'

import { useState } from 'react'
import type { OnboardingData, Skills } from '@/lib/types/onboarding'

interface Props {
  data: Partial<OnboardingData>
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  isFirst: boolean
  isLast: boolean
}

export function SkillsStep({ data, onNext, onBack }: Props) {
  const [skills, setSkills] = useState<Skills>(
    data.skills || {
      technical: [],
      soft: [],
      languages: [],
      certifications: [],
    }
  )

  const [techInput, setTechInput] = useState('')
  const [softInput, setSoftInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ skills })
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add your technical and soft skills
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Technical Skills</label>
          <p className="text-xs text-zinc-500">Programming languages, frameworks, tools, etc.</p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnical())}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="e.g., JavaScript, React, Node.js"
            />
            <button
              type="button"
              onClick={addTechnical}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-50 dark:text-zinc-900"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.technical.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    setSkills({
                      ...skills,
                      technical: skills.technical.filter((_, i) => i !== index),
                    })
                  }
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Soft Skills</label>
          <p className="text-xs text-zinc-500">Communication, leadership, teamwork, etc.</p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={softInput}
              onChange={(e) => setSoftInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSoft())}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="e.g., Communication, Leadership"
            />
            <button
              type="button"
              onClick={addSoft}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-50 dark:text-zinc-900"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.soft.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    setSkills({
                      ...skills,
                      soft: skills.soft.filter((_, i) => i !== index),
                    })
                  }
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-zinc-300 px-6 py-2 font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={skills.technical.length === 0}
          className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          Next
        </button>
      </div>
    </form>
  )
}
