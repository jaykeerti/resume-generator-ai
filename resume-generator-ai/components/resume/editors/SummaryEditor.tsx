'use client'

import React from 'react'

interface SummaryEditorProps {
  summary: string
  onChange: (summary: string) => void
}

export function SummaryEditor({ summary, onChange }: SummaryEditorProps) {
  const characterCount = summary.length
  const recommendedMax = 500

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="professional_summary" className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <span className={`text-xs ${characterCount > recommendedMax ? 'text-orange-600' : 'text-gray-500'}`}>
            {characterCount} / {recommendedMax} characters
          </span>
        </div>
        <textarea
          id="professional_summary"
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Write a brief professional summary highlighting your key skills, experience, and career objectives. Keep it concise and impactful - aim for 2-4 sentences."
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for a Great Summary</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Start with your job title and years of experience</li>
          <li>• Highlight 2-3 key skills or achievements</li>
          <li>• Mention what you're looking for in your next role</li>
          <li>• Keep it concise - aim for 2-4 sentences</li>
        </ul>
      </div>
    </div>
  )
}
