'use client'

import { useState } from 'react'
import type { OnboardingData, Education } from '@/lib/types/onboarding'

interface Props {
  data: Partial<OnboardingData>
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  isFirst: boolean
  isLast: boolean
}

export function EducationStep({ data, onNext, onBack }: Props) {
  const [education, setEducation] = useState<Education[]>(data.education || [])
  const [current, setCurrent] = useState<Partial<Education>>({
    institution: '',
    degree_type: '',
    field_of_study: '',
    graduation_date: '',
    gpa: '',
    coursework: '',
  })

  const addEducation = () => {
    if (current.institution && current.degree_type && current.field_of_study) {
      setEducation([...education, current as Education])
      setCurrent({
        institution: '',
        degree_type: '',
        field_of_study: '',
        graduation_date: '',
        gpa: '',
        coursework: '',
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ education })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Education</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add your educational background
        </p>
      </div>

      {education.length > 0 && (
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div
              key={index}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {edu.degree_type} in {edu.field_of_study}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {edu.institution} • {edu.graduation_date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEducation(education.filter((_, i) => i !== index))}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Institution</label>
            <input
              type="text"
              value={current.institution}
              onChange={(e) => setCurrent({ ...current, institution: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="University name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Degree Type</label>
            <input
              type="text"
              value={current.degree_type}
              onChange={(e) => setCurrent({ ...current, degree_type: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Bachelor's, Master's, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Field of Study</label>
            <input
              type="text"
              value={current.field_of_study}
              onChange={(e) => setCurrent({ ...current, field_of_study: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Computer Science"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Graduation Date</label>
            <input
              type="month"
              value={current.graduation_date}
              onChange={(e) => setCurrent({ ...current, graduation_date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">GPA (optional)</label>
            <input
              type="text"
              value={current.gpa}
              onChange={(e) => setCurrent({ ...current, gpa: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="3.8"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Add Education
        </button>
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
          disabled={education.length === 0}
          className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          Next
        </button>
      </div>
    </form>
  )
}
