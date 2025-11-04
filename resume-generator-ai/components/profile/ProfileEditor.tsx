'use client'

import { useState } from 'react'
import { PersonalInfoEditor } from './editors/PersonalInfoEditor'
import { ExperienceEditor } from './editors/ExperienceEditor'
import { EducationEditor } from './editors/EducationEditor'
import { SkillsEditor } from './editors/SkillsEditor'
import type { OnboardingData } from '@/lib/types/onboarding'

interface Props {
  baseInfo: {
    personal_info: OnboardingData['personal_info']
    work_experience: OnboardingData['work_experience']
    education: OnboardingData['education']
    skills: OnboardingData['skills']
    additional_sections: OnboardingData['additional_sections']
  }
  userId: string
}

type Tab = 'personal' | 'experience' | 'education' | 'skills'

export function ProfileEditor({ baseInfo }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('personal')

  const tabs = [
    { id: 'personal' as Tab, label: 'Personal Info', icon: '👤' },
    { id: 'experience' as Tab, label: 'Experience', icon: '💼' },
    { id: 'education' as Tab, label: 'Education', icon: '🎓' },
    { id: 'skills' as Tab, label: 'Skills', icon: '⚡' },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                ← Back to Dashboard
              </a>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              {activeTab === 'personal' && <PersonalInfoEditor data={baseInfo.personal_info} />}
              {activeTab === 'experience' && <ExperienceEditor data={baseInfo.work_experience} />}
              {activeTab === 'education' && <EducationEditor data={baseInfo.education} />}
              {activeTab === 'skills' && <SkillsEditor data={baseInfo.skills} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
