'use client'

import React from 'react'
import type { TemplateId, TemplateCustomization, FontFamily, FontSize } from '@/lib/types/resume'
import { TEMPLATES, FONT_OPTIONS, FONT_SIZE_OPTIONS, PRESET_COLORS } from '@/lib/templates/config'

interface TemplateSelectorProps {
  selectedTemplateId: TemplateId
  customization: TemplateCustomization
  onTemplateChange: (templateId: TemplateId) => void
  onCustomizationChange: (customization: TemplateCustomization) => void
}

export function TemplateSelector({
  selectedTemplateId,
  customization,
  onTemplateChange,
  onCustomizationChange
}: TemplateSelectorProps) {
  const handleColorChange = (color: string) => {
    onCustomizationChange({ ...customization, accent_color: color })
  }

  const handleFontChange = (font: FontFamily) => {
    onCustomizationChange({ ...customization, font })
  }

  const handleFontSizeChange = (fontSize: FontSize) => {
    onCustomizationChange({ ...customization, font_size: fontSize })
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Template</h3>
        <div className="grid grid-cols-1 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onTemplateChange(template.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all hover:border-blue-400 ${
                selectedTemplateId === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-16 h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <span className="text-2xl">{template.id === 'classic' ? '📄' : template.id === 'modern' ? '🎨' : '✨'}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </div>
                {selectedTemplateId === template.id && (
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Accent Color</h3>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                customization.accent_color === color.value
                  ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {customization.accent_color === color.value && (
                <svg className="w-4 h-4 text-white mx-auto drop-shadow" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <label className="text-xs text-gray-600 mb-1 block">Custom Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={customization.accent_color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={customization.accent_color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
              placeholder="#3B82F6"
            />
          </div>
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Font</h3>
        <select
          value={customization.font}
          onChange={(e) => handleFontChange(e.target.value as FontFamily)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Font Size</h3>
        <div className="space-y-2">
          {FONT_SIZE_OPTIONS.map((size) => (
            <label
              key={size.value}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:border-blue-400 ${
                customization.font_size === size.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <input
                type="radio"
                name="font-size"
                value={size.value}
                checked={customization.font_size === size.value}
                onChange={(e) => handleFontSizeChange(e.target.value as FontSize)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-900">{size.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
