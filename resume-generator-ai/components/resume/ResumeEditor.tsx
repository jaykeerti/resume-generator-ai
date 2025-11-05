'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import type { Resume, ResumeContent, TemplateCustomization, TemplateId } from '@/lib/types/resume'
import { TemplateSelector } from '@/components/templates/TemplateSelector'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { PersonalInfoEditor } from '@/components/resume/editors/PersonalInfoEditor'
import { SummaryEditor } from '@/components/resume/editors/SummaryEditor'
import { ExperienceEditor } from '@/components/resume/editors/ExperienceEditor'
import { EducationEditor } from '@/components/resume/editors/EducationEditor'
import { SkillsEditor } from '@/components/resume/editors/SkillsEditor'
import { AdditionalSectionsEditor } from '@/components/resume/editors/AdditionalSectionsEditor'
import { TEMPLATES } from '@/lib/templates/config'

interface ResumeEditorProps {
  resume: Resume
  onSave: (updates: Partial<Resume>) => Promise<void>
}

type EditorTab = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'additional'

export function ResumeEditor({ resume, onSave }: ResumeEditorProps) {
  const [title, setTitle] = useState(resume.title)
  const [templateId, setTemplateId] = useState<TemplateId>(resume.template_id)
  const [customization, setCustomization] = useState<TemplateCustomization>(resume.customization)
  const [content, setContent] = useState<ResumeContent>(resume.content)
  const [activeTab, setActiveTab] = useState<EditorTab>('personal')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [previewScale, setPreviewScale] = useState(0.7)
  const [showStyling, setShowStyling] = useState(true)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-save debounced
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    setSaveStatus('unsaved')

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving')
      setIsSaving(true)
      try {
        await onSave({
          title,
          template_id: templateId,
          customization,
          content
        })
        setSaveStatus('saved')
      } catch (error) {
        console.error('Auto-save failed:', error)
        setSaveStatus('unsaved')
      } finally {
        setIsSaving(false)
      }
    }, 2000) // Save after 2 seconds of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, templateId, customization, content, onSave])

  const handleTemplateChange = useCallback((newTemplateId: TemplateId) => {
    setTemplateId(newTemplateId)
    // Reset customization to template defaults
    const template = TEMPLATES.find(t => t.id === newTemplateId)
    if (template) {
      setCustomization(template.defaultCustomization)
    }
  }, [])

  const handleCustomizationChange = useCallback((newCustomization: TemplateCustomization) => {
    setCustomization(newCustomization)
  }, [])

  const handleContentChange = useCallback((newContent: ResumeContent) => {
    setContent(newContent)
  }, [])

  const tabs = [
    { id: 'personal' as const, label: 'Personal', icon: '👤' },
    { id: 'summary' as const, label: 'Summary', icon: '📝' },
    { id: 'experience' as const, label: 'Experience', icon: '💼' },
    { id: 'education' as const, label: 'Education', icon: '🎓' },
    { id: 'skills' as const, label: 'Skills', icon: '⚡' },
    { id: 'additional' as const, label: 'Additional', icon: '✨' }
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </a>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 px-2 py-1 rounded hover:bg-gray-50"
              placeholder="Resume Title"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {saveStatus === 'saved' && '✓ All changes saved'}
              {saveStatus === 'saving' && '⏳ Saving...'}
              {saveStatus === 'unsaved' && '• Unsaved changes'}
            </span>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSaving}
            >
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Content Editors */}
        <aside className="w-full lg:w-80 xl:w-96 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline text-xs lg:text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Content Editors Only */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {activeTab === 'personal' && (
              <PersonalInfoEditor
                personalInfo={content.personal_info}
                onChange={(personalInfo) => setContent({ ...content, personal_info: personalInfo })}
              />
            )}
            {activeTab === 'summary' && (
              <SummaryEditor
                summary={content.professional_summary || ''}
                onChange={(summary) => setContent({ ...content, professional_summary: summary })}
              />
            )}
            {activeTab === 'experience' && (
              <ExperienceEditor
                experiences={content.work_experience}
                onChange={(work_experience) => setContent({ ...content, work_experience })}
              />
            )}
            {activeTab === 'education' && (
              <EducationEditor
                education={content.education}
                onChange={(education) => setContent({ ...content, education })}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsEditor
                skills={content.skills}
                onChange={(skills) => setContent({ ...content, skills })}
              />
            )}
            {activeTab === 'additional' && (
              <AdditionalSectionsEditor
                sections={content.additional_sections}
                onChange={(additional_sections) => setContent({ ...content, additional_sections })}
              />
            )}
          </div>
        </aside>

        {/* Center Panel - Preview (Desktop only) */}
        <main className="hidden lg:flex flex-1 bg-gray-100 overflow-hidden flex-col border-r border-gray-200">
          {/* Preview Controls */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))}
                className="p-2 hover:bg-gray-100 rounded"
                title="Zoom out"
              >
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
                </svg>
              </button>
              <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale(Math.min(1.5, previewScale + 0.1))}
                className="p-2 hover:bg-gray-100 rounded"
                title="Zoom in"
              >
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                </svg>
              </button>
              <button
                onClick={() => setPreviewScale(1)}
                className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-[8.5in] mx-auto shadow-2xl">
              <TemplateRenderer
                templateId={templateId}
                content={content}
                customization={customization}
                scale={previewScale}
              />
            </div>
          </div>
        </main>

        {/* Right Panel - Styling Controls */}
        <aside className="w-full lg:w-80 xl:w-96 bg-white border-t lg:border-t-0 border-gray-200 flex flex-col">
          <div className="border-b border-gray-200 px-4 lg:px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">🎨 Styling</span>
              <button
                onClick={() => setShowStyling(!showStyling)}
                className="text-sm text-gray-600 hover:text-gray-900 lg:hidden"
              >
                {showStyling ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto ${showStyling ? 'block' : 'hidden'} lg:block`}>
            <div className="p-4 lg:p-6">
              <TemplateSelector
                selectedTemplateId={templateId}
                customization={customization}
                onTemplateChange={handleTemplateChange}
                onCustomizationChange={handleCustomizationChange}
              />
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="lg:hidden bg-gray-100 border-t border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
                  </svg>
                </button>
                <span className="text-xs text-gray-600 min-w-[3rem] text-center">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  onClick={() => setPreviewScale(Math.min(1.5, previewScale + 0.1))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-auto p-4 max-h-96">
              <div className="max-w-[8.5in] mx-auto shadow-2xl">
                <TemplateRenderer
                  templateId={templateId}
                  content={content}
                  customization={customization}
                  scale={previewScale}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
