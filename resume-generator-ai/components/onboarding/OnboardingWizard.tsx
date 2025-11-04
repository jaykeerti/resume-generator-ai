'use client'

import { useState } from 'react'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { WorkExperienceStep } from './steps/WorkExperienceStep'
import { EducationStep } from './steps/EducationStep'
import { SkillsStep } from './steps/SkillsStep'
import { AdditionalStep } from './steps/AdditionalStep'
import type { OnboardingData } from '@/lib/types/onboarding'

const STEPS = [
  { id: 1, name: 'Personal Info', component: PersonalInfoStep },
  { id: 2, name: 'Work Experience', component: WorkExperienceStep },
  { id: 3, name: 'Education', component: EducationStep },
  { id: 4, name: 'Skills', component: SkillsStep },
  { id: 5, name: 'Additional', component: AdditionalStep },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<Partial<OnboardingData>>({})

  const handleNext = (stepData: Partial<OnboardingData>) => {
    setData({ ...data, ...stepData })
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
      <div className="mx-auto max-w-3xl px-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      currentStep > step.id
                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black'
                        : currentStep === step.id
                        ? 'border-zinc-900 text-zinc-900 dark:border-zinc-50 dark:text-zinc-50'
                        : 'border-zinc-300 text-zinc-300 dark:border-zinc-700 dark:text-zinc-700'
                    }`}
                  >
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  <span
                    className={`mt-2 text-xs ${
                      currentStep >= step.id
                        ? 'font-medium text-zinc-900 dark:text-zinc-50'
                        : 'text-zinc-500 dark:text-zinc-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      currentStep > step.id
                        ? 'bg-zinc-900 dark:bg-zinc-50'
                        : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-900">
          <CurrentStepComponent
            data={data}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentStep === 1}
            isLast={currentStep === STEPS.length}
          />
        </div>
      </div>
    </div>
  )
}
