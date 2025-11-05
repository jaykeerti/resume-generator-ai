'use client'

import React from 'react'
import type { ResumeContent, TemplateCustomization, TemplateId } from '@/lib/types/resume'
import { ClassicTemplate } from './ClassicTemplate'
import { ModernTemplate } from './ModernTemplate'
import { MinimalTemplate } from './MinimalTemplate'

interface TemplateRendererProps {
  templateId: TemplateId
  content: ResumeContent
  customization: TemplateCustomization
  scale?: number
}

export function TemplateRenderer({ templateId, content, customization, scale = 1 }: TemplateRendererProps) {
  const renderTemplate = () => {
    switch (templateId) {
      case 'classic':
        return <ClassicTemplate content={content} customization={customization} />
      case 'modern':
        return <ModernTemplate content={content} customization={customization} />
      case 'minimal':
        return <MinimalTemplate content={content} customization={customization} />
      default:
        return <ClassicTemplate content={content} customization={customization} />
    }
  }

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`
      }}
    >
      {renderTemplate()}
    </div>
  )
}
