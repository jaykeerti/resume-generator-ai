'use client'

import React, { useState } from 'react'
import type { ResumeAdditionalSections, ResumeProject } from '@/lib/types/resume'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { FormInput, FormTextarea, Button, Badge } from '@/components/ui'

interface AdditionalSectionsEditorProps {
  sections: ResumeAdditionalSections
  onChange: (sections: ResumeAdditionalSections) => void
}

export function AdditionalSectionsEditor({ sections, onChange }: AdditionalSectionsEditorProps) {
  return (
    <div className="space-y-6">
      <ProjectsSection
        projects={sections.projects}
        onChange={(projects) => onChange({ ...sections, projects })}
      />
      <SimpleListSection
        title="Volunteer Work"
        items={sections.volunteer}
        onChange={(volunteer) => onChange({ ...sections, volunteer })}
        placeholder="e.g., Volunteer Math Tutor at Local Community Center (2022-Present)"
      />
      <SimpleListSection
        title="Awards & Achievements"
        items={sections.awards}
        onChange={(awards) => onChange({ ...sections, awards })}
        placeholder="e.g., Employee of the Year 2023, Dean's List"
      />
      <SimpleListSection
        title="Publications"
        items={sections.publications}
        onChange={(publications) => onChange({ ...sections, publications })}
        placeholder="e.g., Paper title, Conference/Journal name, Year"
      />
    </div>
  )
}

interface ProjectsSectionProps {
  projects: ResumeProject[]
  onChange: (projects: ResumeProject[]) => void
}

function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  const { showModal } = useNotifications()
  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const emptyProject: ResumeProject = {
    title: '',
    description: '',
    link: '',
    technologies: []
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingIndex(null)
  }

  const handleSaveNew = (project: ResumeProject) => {
    onChange([...projects, project])
    setIsAdding(false)
  }

  const handleUpdate = (index: number, project: ResumeProject) => {
    const updated = [...projects]
    updated[index] = project
    onChange(updated)
    setEditingIndex(null)
  }

  const handleDelete = async (index: number) => {
    const confirmed = await showModal({
      title: 'Delete Project?',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive'
    })

    if (confirmed) {
      onChange(projects.filter((_, i) => i !== index))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Projects</h4>
        <Button
          onClick={handleAdd}
          variant="primary"
          size="sm"
        >
          + Add Project
        </Button>
      </div>

      {projects.map((project, index) => (
        <div key={index} className="mb-3">
          {editingIndex === index ? (
            <ProjectForm
              project={project}
              onSave={(updated) => handleUpdate(index, updated)}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{project.title}</h5>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => setEditingIndex(index)}
                    className="p-1 hover:bg-gray-100 rounded text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1 hover:bg-gray-100 rounded text-red-600 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {isAdding && (
        <ProjectForm
          project={emptyProject}
          onSave={handleSaveNew}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </div>
  )
}

interface ProjectFormProps {
  project: ResumeProject
  onSave: (project: ResumeProject) => void
  onCancel: () => void
}

function ProjectForm({ project: initialProject, onSave, onCancel }: ProjectFormProps) {
  const [project, setProject] = useState(initialProject)
  const [techInput, setTechInput] = useState('')

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setProject({
        ...project,
        technologies: [...project.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const handleRemoveTechnology = (index: number) => {
    setProject({
      ...project,
      technologies: project.technologies.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(project)
  }

  return (
    <form onSubmit={handleSubmit} className="border border-blue-300 rounded-lg p-3 bg-blue-50">
      <div className="space-y-3">
        <FormInput
          label="Project Title"
          type="text"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          required
        />
        <FormTextarea
          label="Description"
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          rows={3}
          required
        />
        <FormInput
          label="Project Link (optional)"
          type="url"
          value={project.link || ''}
          onChange={(e) => setProject({ ...project, link: e.target.value })}
          placeholder="https://github.com/..."
        />
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Technologies</label>
          <div className="flex gap-2 mb-2">
            <FormInput
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
              placeholder="e.g., React, Node.js"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddTechnology}
              variant="secondary"
              size="sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech, index) => (
              <Badge
                key={index}
                variant="gray"
                onRemove={() => handleRemoveTechnology(index)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-3">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          size="sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
        >
          Save
        </Button>
      </div>
    </form>
  )
}

interface SimpleListSectionProps {
  title: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
}

function SimpleListSection({ title, items, onChange, placeholder }: SimpleListSectionProps) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (input.trim()) {
      onChange([...items, input.trim()])
      setInput('')
    }
  }

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="flex gap-2 mb-2">
        <FormInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="primary"
          size="sm"
        >
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-2 bg-gray-50 rounded-lg group"
          >
            <p className="text-sm flex-1 mr-2">{item}</p>
            <Button
              type="button"
              onClick={() => handleRemove(index)}
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              🗑️
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
