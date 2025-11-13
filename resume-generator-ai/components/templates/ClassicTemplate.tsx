'use client'

import React from 'react'
import type { ResumeContent, TemplateCustomization } from '@/lib/types/resume'
import { TemplateWrapper } from './base/TemplateWrapper'
import { TemplateSection } from './base/TemplateSection'
import { renderContent } from '@/lib/utils/textFormatting'

interface ClassicTemplateProps {
  content: ResumeContent
  customization: TemplateCustomization
}

export function ClassicTemplate({ content, customization }: ClassicTemplateProps) {
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
    <TemplateWrapper customization={customization} className="max-w-[8.5in] mx-auto p-12">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>
          {personal_info.full_name}
        </h1>
        {personal_info.professional_title && (
          <p className="text-lg text-gray-600 mb-3">{personal_info.professional_title}</p>
        )}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700">
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>•</span>}
          {personal_info.phone && <span>{personal_info.phone}</span>}
          {personal_info.location && <span>•</span>}
          {personal_info.location && <span>{personal_info.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700 mt-1">
          {personal_info.linkedin_url && (
            <a href={personal_info.linkedin_url} className="hover:underline" style={{ color: 'var(--accent-color)' }}>
              LinkedIn
            </a>
          )}
          {personal_info.portfolio_url && personal_info.linkedin_url && <span>•</span>}
          {personal_info.portfolio_url && (
            <a href={personal_info.portfolio_url} className="hover:underline" style={{ color: 'var(--accent-color)' }}>
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {professional_summary && typeof professional_summary === 'string' && professional_summary.trim() && (
        <TemplateSection title="Professional Summary">
          <div className="text-sm leading-relaxed">{renderContent(professional_summary)}</div>
        </TemplateSection>
      )}

      {/* Work Experience */}
      {safeWorkExperience.length > 0 && (
        <TemplateSection title="Work Experience">
          {safeWorkExperience.map((exp, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base">{exp.job_title}</h3>
                <span className="text-sm text-gray-600">
                  {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date || ''}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                {exp.location && <span className="text-sm text-gray-600">{exp.location}</span>}
              </div>
              {exp.responsibilities.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {exp.responsibilities
                    .filter(resp => resp && typeof resp === 'string')
                    .map((resp, i) => (
                      <li key={i} className="text-sm text-gray-800">{renderContent(resp)}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </TemplateSection>
      )}

      {/* Education */}
      {safeEducation.length > 0 && (
        <TemplateSection title="Education">
          {safeEducation.map((edu, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base">{edu.institution}</h3>
                <span className="text-sm text-gray-600">{edu.graduation_date}</span>
              </div>
              <p className="text-sm text-gray-700">
                {edu.degree_type} {edu.field_of_study && `in ${edu.field_of_study}`}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
              {edu.coursework && (
                <p className="text-sm text-gray-600 mt-1">Relevant Coursework: {edu.coursework}</p>
              )}
            </div>
          ))}
        </TemplateSection>
      )}

      {/* Skills */}
      {(safeSkills.technical.length > 0 || safeSkills.soft.length > 0 || safeSkills.languages.length > 0) && (
        <TemplateSection title="Skills">
          {safeSkills.technical.length > 0 && (
            <div className="mb-2" style={{ textAlign: 'justify' }}>
              <span className="font-semibold text-sm">Technical: </span>
              <span className="text-sm">{safeSkills.technical.join(', ')}</span>
            </div>
          )}
          {safeSkills.soft.length > 0 && (
            <div className="mb-2" style={{ textAlign: 'justify' }}>
              <span className="font-semibold text-sm">Soft Skills: </span>
              <span className="text-sm">{safeSkills.soft.join(', ')}</span>
            </div>
          )}
          {safeSkills.languages.length > 0 && (
            <div className="mb-2" style={{ textAlign: 'justify' }}>
              <span className="font-semibold text-sm">Languages: </span>
              <span className="text-sm">
                {safeSkills.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
              </span>
            </div>
          )}
          {safeSkills.certifications.length > 0 && (
            <div>
              <p className="font-semibold text-sm mb-1">Certifications:</p>
              <ul className="list-disc list-outside ml-5 space-y-1">
                {safeSkills.certifications.map((cert, i) => (
                  <li key={i} className="text-sm">
                    {cert.name} - {cert.org} ({cert.date})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TemplateSection>
      )}

      {/* Projects */}
      {safeAdditional.projects.length > 0 && (
        <TemplateSection title="Projects">
          {safeAdditional.projects.map((project, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="font-bold text-sm">{project.title}</h3>
                {project.link && (
                  <a href={project.link} className="text-xs hover:underline" style={{ color: 'var(--accent-color)' }}>
                    Link
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-700 mb-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Technologies: </span>
                  {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </TemplateSection>
      )}

      {/* Additional Sections */}
      {safeAdditional.awards.length > 0 && (
        <TemplateSection title="Awards & Achievements">
          <ul className="list-disc list-outside ml-5 space-y-1">
            {safeAdditional.awards.map((award, i) => (
              <li key={i} className="text-sm">{award}</li>
            ))}
          </ul>
        </TemplateSection>
      )}

      {safeAdditional.volunteer.length > 0 && (
        <TemplateSection title="Volunteer Work">
          <ul className="list-disc list-outside ml-5 space-y-1">
            {safeAdditional.volunteer.map((vol, i) => (
              <li key={i} className="text-sm">{vol}</li>
            ))}
          </ul>
        </TemplateSection>
      )}

      {safeAdditional.publications.length > 0 && (
        <TemplateSection title="Publications">
          <ul className="list-disc list-outside ml-5 space-y-1">
            {safeAdditional.publications.map((pub, i) => (
              <li key={i} className="text-sm">{pub}</li>
            ))}
          </ul>
        </TemplateSection>
      )}
    </TemplateWrapper>
  )
}
