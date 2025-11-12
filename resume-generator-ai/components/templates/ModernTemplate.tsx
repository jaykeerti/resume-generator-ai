'use client'

import React from 'react'
import type { ResumeContent, TemplateCustomization } from '@/lib/types/resume'
import { TemplateWrapper } from './base/TemplateWrapper'
import { renderContent } from '@/lib/utils/textFormatting'

interface ModernTemplateProps {
  content: ResumeContent
  customization: TemplateCustomization
}

export function ModernTemplate({ content, customization }: ModernTemplateProps) {
  const { personal_info, professional_summary, work_experience, education, skills, additional_sections } = content

  // Ensure all arrays exist with safe defaults
  const safeWorkExperience = work_experience || []
  const safeEducation = education || []
  const safeSkills = {
    technical: skills?.technical || [],
    soft: skills?.soft || [],
    languages: skills?.languages || [],
    certifications: skills?.certifications || []
  }
  const safeAdditional = {
    projects: additional_sections?.projects || [],
    volunteer: additional_sections?.volunteer || [],
    awards: additional_sections?.awards || [],
    publications: additional_sections?.publications || []
  }

  return (
    <TemplateWrapper customization={customization} className="max-w-[8.5in] mx-auto">
      <div className="grid grid-cols-[35%_65%] min-h-screen">
        {/* Left Sidebar - Accent Color */}
        <aside
          className="p-8 text-white"
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'white'
          }}
        >
          {/* Personal Info */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{personal_info.full_name}</h1>
            {personal_info.professional_title && (
              <p className="text-sm opacity-90 mb-4">{personal_info.professional_title}</p>
            )}
          </div>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-base font-bold uppercase mb-3 pb-1 border-b border-white/30">
              Contact
            </h2>
            <div className="space-y-2 text-sm">
              {personal_info.email && <p className="break-words">{personal_info.email}</p>}
              {personal_info.phone && <p>{personal_info.phone}</p>}
              {personal_info.location && <p>{personal_info.location}</p>}
              {personal_info.linkedin_url && (
                <p className="break-words">
                  <a href={personal_info.linkedin_url} className="hover:underline">
                    LinkedIn
                  </a>
                </p>
              )}
              {personal_info.portfolio_url && (
                <p className="break-words">
                  <a href={personal_info.portfolio_url} className="hover:underline">
                    Portfolio
                  </a>
                </p>
              )}
            </div>
          </section>

          {/* Skills */}
          {(safeSkills.technical.length > 0 || safeSkills.soft.length > 0) && (
            <section className="mb-8">
              <h2 className="text-base font-bold uppercase mb-3 pb-1 border-b border-white/30">
                Skills
              </h2>
              {safeSkills.technical.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold text-sm mb-2">Technical</p>
                  <div className="flex flex-wrap gap-1">
                    {safeSkills.technical.map((skill, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white/20 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {safeSkills.soft.length > 0 && (
                <div>
                  <p className="font-semibold text-sm mb-2">Soft Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {safeSkills.soft.map((skill, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white/20 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Languages */}
          {safeSkills.languages.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold uppercase mb-3 pb-1 border-b border-white/30">
                Languages
              </h2>
              <ul className="space-y-2 text-sm">
                {safeSkills.languages.map((lang, i) => (
                  <li key={i}>
                    {lang.name} <span className="text-xs opacity-80">({lang.proficiency})</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {safeSkills.certifications.length > 0 && (
            <section>
              <h2 className="text-base font-bold uppercase mb-3 pb-1 border-b border-white/30">
                Certifications
              </h2>
              <ul className="space-y-2 text-xs">
                {safeSkills.certifications.map((cert, i) => (
                  <li key={i}>
                    <p className="font-semibold">{cert.name}</p>
                    <p className="opacity-80">{cert.org} • {cert.date}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right Content Area */}
        <main className="p-8 bg-white">
          {/* Professional Summary */}
          {professional_summary && professional_summary.trim() && (
            <section className="mb-8">
              <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-gray-300">
                Professional Summary
              </h2>
              <div className="text-sm leading-relaxed text-gray-800">{renderContent(professional_summary)}</div>
            </section>
          )}

          {/* Work Experience */}
          {safeWorkExperience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-gray-300">
                Work Experience
              </h2>
              <div className="space-y-5">
                {safeWorkExperience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-base text-gray-900">{exp.job_title}</h3>
                      <span className="text-xs text-gray-600">
                        {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date || ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <p className="text-sm font-semibold" style={{ color: 'var(--accent-color)' }}>
                        {exp.company}
                      </p>
                      {exp.location && <span className="text-xs text-gray-600">{exp.location}</span>}
                    </div>
                    {exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-outside ml-5 space-y-1">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="text-sm text-gray-700">{renderContent(resp)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {safeEducation.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-gray-300">
                Education
              </h2>
              <div className="space-y-4">
                {safeEducation.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-base text-gray-900">{edu.institution}</h3>
                      <span className="text-xs text-gray-600">{edu.graduation_date}</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {edu.degree_type} {edu.field_of_study && `in ${edu.field_of_study}`}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                    {edu.coursework && (
                      <p className="text-xs text-gray-600 mt-1">Relevant Coursework: {edu.coursework}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {safeAdditional.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-gray-300">
                Projects
              </h2>
              <div className="space-y-4">
                {safeAdditional.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-bold text-sm text-gray-900">{project.title}</h3>
                      {project.link && (
                        <a href={project.link} className="text-xs hover:underline" style={{ color: 'var(--accent-color)' }}>
                          Link
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Tech: </span>
                        {project.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Sections */}
          {safeAdditional.awards.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-gray-300">
                Awards
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-1">
                {safeAdditional.awards.map((award, i) => (
                  <li key={i} className="text-sm text-gray-700">{award}</li>
                ))}
              </ul>
            </section>
          )}

          {safeAdditional.volunteer.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase mb-3 pb-1 border-b-2 border-gray-300">
                Volunteer Work
              </h2>
              <ul className="list-disc list-outside ml-5 space-y-1">
                {safeAdditional.volunteer.map((vol, i) => (
                  <li key={i} className="text-sm text-gray-700">{vol}</li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </TemplateWrapper>
  )
}
