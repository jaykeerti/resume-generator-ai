'use client'

import { useState } from 'react'
import type { OnboardingData, WorkExperience } from '@/lib/types/onboarding'

interface Props {
  data: Partial<OnboardingData>
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  isFirst: boolean
  isLast: boolean
}

export function WorkExperienceStep({ data, onNext, onBack }: Props) {
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    data.work_experience || []
  )
  const [currentExp, setCurrentExp] = useState<Partial<WorkExperience>>({
    company: '',
    job_title: '',
    start_date: '',
    end_date: '',
    is_current: false,
    location: '',
    responsibilities: [''],
  })

  const addExperience = () => {
    if (currentExp.company && currentExp.job_title) {
      setExperiences([...experiences, currentExp as WorkExperience])
      setCurrentExp({
        company: '',
        job_title: '',
        start_date: '',
        end_date: '',
        is_current: false,
        location: '',
        responsibilities: [''],
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ work_experience: experiences })
  }

  const updateResponsibility = (index: number, value: string) => {
    const newResp = [...(currentExp.responsibilities || [])]
    newResp[index] = value
    setCurrentExp({ ...currentExp, responsibilities: newResp })
  }

  const addResponsibility = () => {
    setCurrentExp({
      ...currentExp,
      responsibilities: [...(currentExp.responsibilities || []), ''],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add your professional work history
        </p>
      </div>

      {/* Added experiences */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Added Experiences</h3>
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{exp.job_title}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {exp.company} • {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new experience */}
      <div className="space-y-4 rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
        <h3 className="font-medium">
          {experiences.length > 0 ? 'Add Another Experience' : 'Add Experience'}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Company</label>
            <input
              type="text"
              value={currentExp.company}
              onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Job Title</label>
            <input
              type="text"
              value={currentExp.job_title}
              onChange={(e) => setCurrentExp({ ...currentExp, job_title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="month"
              value={currentExp.start_date}
              onChange={(e) => setCurrentExp({ ...currentExp, start_date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="month"
              value={currentExp.end_date}
              disabled={currentExp.is_current}
              onChange={(e) => setCurrentExp({ ...currentExp, end_date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <label className="mt-1 flex items-center text-sm">
              <input
                type="checkbox"
                checked={currentExp.is_current}
                onChange={(e) => setCurrentExp({ ...currentExp, is_current: e.target.checked })}
                className="mr-2"
              />
              Current position
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              value={currentExp.location}
              onChange={(e) => setCurrentExp({ ...currentExp, location: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Responsibilities</label>
            {currentExp.responsibilities?.map((resp, index) => (
              <input
                key={index}
                type="text"
                value={resp}
                onChange={(e) => updateResponsibility(index, e.target.value)}
                placeholder="Describe your responsibilities and achievements"
                className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            ))}
            <button
              type="button"
              onClick={addResponsibility}
              className="mt-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              + Add bullet point
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Add Experience
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
          disabled={experiences.length === 0}
          className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Next
        </button>
      </div>
    </form>
  )
}
