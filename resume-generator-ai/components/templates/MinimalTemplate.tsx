'use client'

import React from 'react'
import type { ResumeContent, TemplateCustomization } from '@/lib/types/resume'
import { TemplateWrapper } from './base/TemplateWrapper'

interface MinimalTemplateProps {
  content: ResumeContent
  customization: TemplateCustomization
}

export function MinimalTemplate({ content, customization }: MinimalTemplateProps) {
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
    <TemplateWrapper customization={customization} className="max-w-[8.5in] mx-auto p-16">
      {/* Header - Minimal and Clean */}
      <header className="mb-12">
        <h1 className="text-4xl font-light mb-2 tracking-wide" style={{ color: 'var(--accent-color)' }}>
          {personal_info.full_name}
        </h1>
        {personal_info.professional_title && (
          <p className="text-base text-gray-600 font-light mb-6">{personal_info.professional_title}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>{personal_info.phone}</span>}
          {personal_info.location && <span>{personal_info.location}</span>}
          {personal_info.linkedin_url && (
            <a href={personal_info.linkedin_url} className="hover:underline" style={{ color: 'var(--accent-color)' }}>
              LinkedIn
            </a>
          )}
          {personal_info.portfolio_url && (
            <a href={personal_info.portfolio_url} className="hover:underline" style={{ color: 'var(--accent-color)' }}>
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {professional_summary && professional_summary.trim() && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 text-gray-500">
            Profile
          </h2>
          <div className="text-sm leading-loose text-gray-800 prose prose-sm max-w-none prose-p:m-0 prose-ul:my-1 prose-li:my-0" dangerouslySetInnerHTML={{ __html: professional_summary }} />
        </section>
      )}

      {/* Work Experience */}
      {safeWorkExperience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500">
            Experience
          </h2>
          <div className="space-y-8">
            {safeWorkExperience.map((exp, index) => (
              <div key={index}>
                <div className="mb-2">
                  <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--accent-color)' }}>
                    {exp.job_title}
                  </h3>
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm text-gray-700">{exp.company}</p>
                    <span className="text-xs text-gray-500">
                      {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date || ''}
                    </span>
                  </div>
                  {exp.location && <p className="text-xs text-gray-500 mt-1">{exp.location}</p>}
                </div>
                {exp.responsibilities.length > 0 && (
                  <ul className="space-y-2 mt-3">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-gray-200 prose prose-sm max-w-none prose-p:inline prose-strong:font-bold prose-em:italic" dangerouslySetInnerHTML={{ __html: resp }} />
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
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500">
            Education
          </h2>
          <div className="space-y-6">
            {safeEducation.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-base" style={{ color: 'var(--accent-color)' }}>
                    {edu.institution}
                  </h3>
                  <span className="text-xs text-gray-500">{edu.graduation_date}</span>
                </div>
                <p className="text-sm text-gray-700">
                  {edu.degree_type} {edu.field_of_study && `in ${edu.field_of_study}`}
                </p>
                {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                {edu.coursework && (
                  <p className="text-xs text-gray-600 mt-2">Coursework: {edu.coursework}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(safeSkills.technical.length > 0 || safeSkills.soft.length > 0 || safeSkills.languages.length > 0) && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500">
            Skills
          </h2>
          <div className="space-y-4">
            {safeSkills.technical.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Technical</p>
                <p className="text-sm text-gray-800 leading-relaxed">{safeSkills.technical.join(' • ')}</p>
              </div>
            )}
            {safeSkills.soft.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Soft Skills</p>
                <p className="text-sm text-gray-800 leading-relaxed">{safeSkills.soft.join(' • ')}</p>
              </div>
            )}
            {safeSkills.languages.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Languages</p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {safeSkills.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications */}
      {safeSkills.certifications.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500">
            Certifications
          </h2>
          <div className="space-y-3">
            {safeSkills.certifications.map((cert, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
                <p className="text-xs text-gray-600">{cert.org} • {cert.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {safeAdditional.projects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500">
            Projects
          </h2>
          <div className="space-y-6">
            {safeAdditional.projects.map((project, index) => (
              <div key={index}>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--accent-color)' }}>
                    {project.title}
                  </h3>
                  {project.link && (
                    <a href={project.link} className="text-xs hover:underline text-gray-600">
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-xs text-gray-600">
                    {project.technologies.join(' • ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {safeAdditional.awards.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500">
            Awards & Achievements
          </h2>
          <ul className="space-y-2">
            {safeAdditional.awards.map((award, i) => (
              <li key={i} className="text-sm text-gray-700 pl-4 border-l-2 border-gray-200">
                {award}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Volunteer Work */}
      {safeAdditional.volunteer.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500">
            Volunteer Work
          </h2>
          <ul className="space-y-2">
            {safeAdditional.volunteer.map((vol, i) => (
              <li key={i} className="text-sm text-gray-700 pl-4 border-l-2 border-gray-200">
                {vol}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Publications */}
      {safeAdditional.publications.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-gray-500">
            Publications
          </h2>
          <ul className="space-y-2">
            {safeAdditional.publications.map((pub, i) => (
              <li key={i} className="text-sm text-gray-700 pl-4 border-l-2 border-gray-200">
                {pub}
              </li>
            ))}
          </ul>
        </section>
      )}
    </TemplateWrapper>
  )
}
