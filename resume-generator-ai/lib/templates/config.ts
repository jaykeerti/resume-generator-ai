import type { TemplateConfig } from '@/lib/types/resume'

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional single-column layout, perfect for ATS systems',
    thumbnail: '/templates/classic-thumb.png',
    defaultCustomization: {
      accent_color: '#3B82F6', // Blue
      font: 'Roboto',
      font_size: 'medium'
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column design with accent sidebar for a contemporary look',
    thumbnail: '/templates/modern-thumb.png',
    defaultCustomization: {
      accent_color: '#0891B2', // Cyan
      font: 'Open Sans',
      font_size: 'medium'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and spacious design with plenty of whitespace',
    thumbnail: '/templates/minimal-thumb.png',
    defaultCustomization: {
      accent_color: '#6366F1', // Indigo
      font: 'Lato',
      font_size: 'medium'
    }
  }
]

export const FONT_OPTIONS = [
  { value: 'Roboto' as const, label: 'Roboto' },
  { value: 'Open Sans' as const, label: 'Open Sans' },
  { value: 'Lato' as const, label: 'Lato' }
]

export const FONT_SIZE_OPTIONS = [
  { value: 'small' as const, label: 'Small (10pt)' },
  { value: 'medium' as const, label: 'Medium (11pt)' },
  { value: 'large' as const, label: 'Large (12pt)' }
]

export const PRESET_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Cyan', value: '#0891B2' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Pink', value: '#DB2777' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Green', value: '#059669' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Gray', value: '#4B5563' }
]
