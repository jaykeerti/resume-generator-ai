'use client'

import type { StructuredResumeData } from '@/lib/types/resume'

interface ParsedDataDisplayProps {
  data: StructuredResumeData
  onEdit?: () => void
  onSave?: () => void
  isSaving?: boolean
}

export function ParsedDataDisplay({ data, onEdit, onSave, isSaving = false }: ParsedDataDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Parsed Resume Data
        </h2>
        <div className="flex gap-3">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Edit Data
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSaving ? 'Saving...' : 'Save to Profile'}
            </button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      {data.personal_info && (
        <Section title="Personal Information">
          <InfoGrid>
            {data.personal_info.full_name && (
              <InfoItem label="Full Name" value={data.personal_info.full_name} />
            )}
            {data.personal_info.email && (
              <InfoItem label="Email" value={data.personal_info.email} />
            )}
            {data.personal_info.phone && (
              <InfoItem label="Phone" value={data.personal_info.phone} />
            )}
            {data.personal_info.location && (
              <InfoItem label="Location" value={data.personal_info.location} />
            )}
            {data.personal_info.linkedin && (
              <InfoItem label="LinkedIn" value={data.personal_info.linkedin} link />
            )}
            {data.personal_info.portfolio && (
              <InfoItem label="Portfolio" value={data.personal_info.portfolio} link />
            )}
            {data.personal_info.github && (
              <InfoItem label="GitHub" value={data.personal_info.github} link />
            )}
          </InfoGrid>
        </Section>
      )}

      {/* Professional Summary */}
      {data.professional_summary && (
        <Section title="Professional Summary">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {data.professional_summary}
          </p>
        </Section>
      )}

      {/* Work Experience */}
      {data.work_experience && data.work_experience.length > 0 && (
        <Section title="Work Experience">
          <div className="space-y-4">
            {data.work_experience.map((exp, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {exp.position}
                    </h4>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {exp.start_date || 'N/A'} - {exp.end_date || 'Present'}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {exp.description}
                  </p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {edu.institution}
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {edu.degree}
                  {edu.field_of_study && ` in ${edu.field_of_study}`}
                </p>
                {edu.location && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{edu.location}</p>
                )}
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {edu.start_date || 'N/A'} - {edu.end_date || 'N/A'}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {project.name}
                </h4>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded bg-zinc-200 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-zinc-600 hover:underline dark:text-zinc-400"
                  >
                    {project.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            {data.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <Section title="Languages">
          <div className="flex flex-wrap gap-2">
            {data.languages.map((language, index) => (
              <span
                key={index}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {language}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Volunteer Work */}
      {data.volunteer_work && data.volunteer_work.length > 0 && (
        <Section title="Volunteer Work">
          <div className="space-y-4">
            {data.volunteer_work.map((volunteer, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {volunteer.role}
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {volunteer.organization}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{volunteer.date}</p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {volunteer.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      {children}
    </div>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}

function InfoItem({ label, value, link = false }: { label: string; value: string; link?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
        {link ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 hover:underline dark:text-zinc-300"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}
