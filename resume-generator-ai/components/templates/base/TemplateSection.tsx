import React from 'react'

interface TemplateSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function TemplateSection({ title, children, className = '' }: TemplateSectionProps) {
  return (
    <section className={`mb-6 ${className}`}>
      <h2
        className="text-lg font-bold uppercase mb-3 pb-1 border-b-2"
        style={{
          borderColor: 'var(--accent-color, #3B82F6)',
          color: 'var(--accent-color, #3B82F6)'
        }}
      >
        {title}
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}
