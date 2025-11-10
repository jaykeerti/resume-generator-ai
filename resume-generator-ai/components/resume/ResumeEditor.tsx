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
type MobileView = 'edit' | 'preview'

export function ResumeEditor({ resume, onSave }: ResumeEditorProps) {
  const [title, setTitle] = useState(resume.title)
  const [templateId, setTemplateId] = useState<TemplateId>(resume.template_id)
  const [customization, setCustomization] = useState<TemplateCustomization>(resume.customization)
  const [content, setContent] = useState<ResumeContent>(resume.content)
  const [activeTab, setActiveTab] = useState<EditorTab>('personal')
  const [mobileView, setMobileView] = useState<MobileView>('edit')
  const [showStylingModal, setShowStylingModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [previewScale, setPreviewScale] = useState(0.7)
  const [showOriginalPreview, setShowOriginalPreview] = useState(false)

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

  // Check if tailoring was applied and original content exists
  const hasTailoredContent = resume.customization?.tailoring_applied === true &&
    resume.customization?.original_content !== undefined

  const handleRevertToOriginal = useCallback(() => {
    if (resume.customization?.original_content) {
      if (confirm('This will replace the AI-tailored content with your original profile data. Continue?')) {
        setContent(resume.customization.original_content as ResumeContent)
        // Update customization to mark tailoring as no longer applied
        setCustomization({
          ...customization,
          tailoring_applied: false,
        })
      }
    }
  }, [resume.customization, customization])

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
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900 flex-shrink-0">
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </a>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base lg:text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 px-1 lg:px-2 py-1 rounded hover:bg-gray-50 flex-1 min-w-0"
              placeholder="Resume Title"
            />
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <span className="hidden md:inline text-sm text-gray-600">
              {saveStatus === 'saved' && '✓ Saved'}
              {saveStatus === 'saving' && '⏳ Saving...'}
              {saveStatus === 'unsaved' && '• Unsaved'}
            </span>
            {/* Mobile Styling Button */}
            <button
              onClick={() => setShowStylingModal(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              title="Styling"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            {hasTailoredContent && (
              <button
                onClick={handleRevertToOriginal}
                className="hidden lg:block px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                title="Revert to original untailored content"
              >
                ↺ Revert to Original
              </button>
            )}
            <button
              className="hidden lg:block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSaving}
            >
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Mobile: Edit/Preview Toggle Tabs */}
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setMobileView('edit')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                mobileView === 'edit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                mobileView === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              👁️ Preview
            </button>
          </div>
        </div>

        {/* Left Panel - Content Editors (Desktop always, Mobile only when mobileView='edit') */}
        <aside className={`w-full lg:w-80 xl:w-96 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col flex-1 min-h-0 ${
          mobileView === 'edit' ? 'flex' : 'hidden'
        } lg:flex`}>
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

        {/* Mobile Preview (only when mobileView='preview') */}
        <div className={`flex-1 min-h-0 lg:hidden bg-gray-100 overflow-hidden flex-col ${
          mobileView === 'preview' ? 'flex' : 'hidden'
        }`}>
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Preview</span>
              {hasTailoredContent && (
                <button
                  onClick={() => setShowOriginalPreview(!showOriginalPreview)}
                  className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  {showOriginalPreview ? '✨ AI' : '📄 Original'}
                </button>
              )}
            </div>
            {hasTailoredContent && (
              <div className="mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  showOriginalPreview
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {showOriginalPreview ? '📄 Viewing Original' : '✨ Viewing AI-Tailored'}
                </span>
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))}
                className="p-2 hover:bg-gray-100 rounded"
                title="Zoom out"
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
                title="Zoom in"
              >
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-[8.5in] mx-auto shadow-2xl">
              <TemplateRenderer
                templateId={templateId}
                content={showOriginalPreview && hasTailoredContent && customization.original_content
                  ? customization.original_content
                  : content}
                customization={customization}
                scale={previewScale}
              />
            </div>
          </div>
        </div>

        {/* Center Panel - Preview (Desktop only) */}
        <main className="hidden lg:flex flex-1 bg-gray-100 overflow-hidden flex-col border-r border-gray-200">
          {/* Preview Controls */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Preview</span>
              {hasTailoredContent && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  showOriginalPreview
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {showOriginalPreview ? '📄 Original' : '✨ AI-Tailored'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasTailoredContent && (
                <>
                  <button
                    onClick={() => setShowOriginalPreview(!showOriginalPreview)}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    title={showOriginalPreview ? 'View AI-Tailored Version' : 'View Original Version'}
                  >
                    {showOriginalPreview ? '✨ Show AI Version' : '📄 Show Original'}
                  </button>
                  <div className="w-px h-6 bg-gray-300" />
                </>
              )}
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
                content={showOriginalPreview && hasTailoredContent && customization.original_content
                  ? customization.original_content
                  : content}
                customization={customization}
                scale={previewScale}
              />
            </div>
          </div>
        </main>

        {/* Right Panel - Styling Controls (Desktop only, Mobile via Modal) */}
        <aside className="hidden lg:flex lg:w-80 xl:w-96 bg-white border-gray-200 flex-col">
          <div className="border-b border-gray-200 px-4 lg:px-6 py-3">
            <span className="text-sm font-semibold text-gray-700">🎨 Styling</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <TemplateSelector
              selectedTemplateId={templateId}
              customization={customization}
              onTemplateChange={handleTemplateChange}
              onCustomizationChange={handleCustomizationChange}
            />
          </div>
        </aside>
      </div>

      {/* Mobile Styling Modal */}
      {showStylingModal && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" onClick={() => setShowStylingModal(false)}>
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">🎨 Styling</span>
              <button
                onClick={() => setShowStylingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <TemplateSelector
                selectedTemplateId={templateId}
                customization={customization}
                onTemplateChange={handleTemplateChange}
                onCustomizationChange={handleCustomizationChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
