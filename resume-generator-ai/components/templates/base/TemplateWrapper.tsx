import React from 'react'
import type { TemplateCustomization } from '@/lib/types/resume'

interface TemplateWrapperProps {
  children: React.ReactNode
  customization: TemplateCustomization
  className?: string
}

const fontSizeMap = {
  small: '10pt',
  medium: '11pt',
  large: '12pt'
}

const fontFamilyMap = {
  'Roboto': 'font-roboto',
  'Open Sans': 'font-opensans',
  'Lato': 'font-lato'
}

export function TemplateWrapper({ children, customization, className = '' }: TemplateWrapperProps) {
  const fontSize = fontSizeMap[customization.font_size]
  const fontFamily = fontFamilyMap[customization.font]

  return (
    <div
      className={`resume-template bg-white ${fontFamily} ${className}`}
      style={{
        fontSize,
        color: '#1F2937', // gray-800
        lineHeight: '1.5',
        '--accent-color': customization.accent_color
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
