'use client'

import React from 'react'
import { RichTextEditor } from '@/components/ui'

interface SummaryEditorProps {
  summary: string
  onChange: (summary: string) => void
}

export function SummaryEditor({ summary, onChange }: SummaryEditorProps) {
  return (
    <div className="space-y-4">
      <RichTextEditor
        label="Professional Summary"
        value={summary}
        onChange={onChange}
        maxLength={800}
        showCount
        minHeight="200px"
        placeholder="Write a brief professional summary highlighting your key skills, experience, and career objectives. Keep it concise and impactful - aim for 2-4 sentences."
        showToolbar={true}
        enableLists={true}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for a Great Summary</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Start with your job title and years of experience</li>
          <li>• Highlight 2-3 key skills or achievements</li>
          <li>• Mention what you're looking for in your next role</li>
          <li>• Keep it concise - aim for 2-4 sentences</li>
          <li>• Use formatting (bold, italic) to emphasize key points</li>
        </ul>
      </div>
    </div>
  )
}
