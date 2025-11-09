import OpenAI from 'openai'
import type { ParsedJobDescription } from './jobDescriptionParser'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export type TailoringMode = 'conservative' | 'moderate'

interface BaseInformation {
  personal_info?: {
    full_name?: string
    email?: string
    phone?: string
    location?: string
    professional_title?: string
    linkedin_url?: string
    portfolio_url?: string
  }
  work_experience?: Array<{
    company: string
    job_title: string
    start_date: string
    end_date?: string
    is_current?: boolean
    location?: string
    responsibilities?: string[]
  }>
  education?: Array<{
    institution: string
    degree_type: string
    field_of_study: string
    graduation_date: string
    gpa?: string
    coursework?: string
  }>
  skills?: {
    technical?: string[]
    soft?: string[]
    languages?: Array<{ name: string; proficiency: string }>
    certifications?: Array<{ name: string; organization: string; date: string }>
  }
  additional_sections?: {
    projects?: Array<{
      name: string
      description: string
      technologies?: string[]
      link?: string
    }>
    volunteer?: any[]
    awards?: any[]
    publications?: any[]
  }
}

interface TailoredResume {
  professional_summary: string
  work_experience: Array<{
    company: string
    job_title: string
    start_date: string
    end_date?: string
    is_current?: boolean
    location?: string
    responsibilities: string[]
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages?: Array<{ name: string; proficiency: string }>
    certifications?: Array<{ name: string; organization: string; date: string }>
  }
  additional_sections?: {
    projects?: Array<{
      name: string
      description: string
      technologies?: string[]
      link?: string
    }>
    volunteer?: any[]
    awards?: any[]
    publications?: any[]
  }
}

/**
 * Tailors resume content based on job description
 * @param baseInfo - User's base profile information
 * @param jobDescription - Parsed job description data
 * @param mode - Tailoring aggressiveness (conservative or moderate)
 */
export async function tailorResume(
  baseInfo: BaseInformation,
  jobDescription: ParsedJobDescription,
  mode: TailoringMode = 'moderate'
): Promise<TailoredResume> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      throw new Error('OpenAI API key is not configured')
    }

    // Build context about the job
    const jobContext = `
Job Title: ${jobDescription.job_title}
Company: ${jobDescription.company || 'Not specified'}
Required Technical Skills: ${jobDescription.technical_skills.join(', ') || 'None specified'}
Required Soft Skills: ${jobDescription.soft_skills.join(', ') || 'None specified'}
Key Responsibilities: ${jobDescription.responsibilities.slice(0, 5).join('; ') || 'None specified'}
Technologies: ${jobDescription.technologies.join(', ') || 'None specified'}
Keywords for ATS: ${jobDescription.keywords.slice(0, 10).join(', ') || 'None specified'}
    `.trim()

    // Generate tailored professional summary
    const summary = await generateProfessionalSummary(
      baseInfo,
      jobContext,
      mode
    )

    // Tailor work experience
    const tailoredExperience = await tailorWorkExperience(
      baseInfo.work_experience || [],
      jobContext,
      mode
    )

    // Reorder and optimize skills
    const tailoredSkills = optimizeSkills(
      baseInfo.skills || { technical: [], soft: [] },
      jobDescription
    )

    // Optimize projects if they exist
    const tailoredProjects = baseInfo.additional_sections?.projects
      ? await optimizeProjects(
          baseInfo.additional_sections.projects,
          jobContext,
          mode
        )
      : undefined

    return {
      professional_summary: summary,
      work_experience: tailoredExperience,
      skills: tailoredSkills,
      additional_sections: {
        projects: tailoredProjects,
        volunteer: baseInfo.additional_sections?.volunteer || [],
        awards: baseInfo.additional_sections?.awards || [],
        publications: baseInfo.additional_sections?.publications || [],
      },
    }
  } catch (error) {
    console.error('Error tailoring resume:', error)
    // Return original content if tailoring fails
    // Ensure responsibilities is always an array (not optional)
    return {
      professional_summary: '',
      work_experience: (baseInfo.work_experience || []).map(exp => ({
        ...exp,
        responsibilities: exp.responsibilities || [],
      })),
      skills: {
        technical: baseInfo.skills?.technical || [],
        soft: baseInfo.skills?.soft || [],
        languages: baseInfo.skills?.languages,
        certifications: baseInfo.skills?.certifications,
      },
      additional_sections: baseInfo.additional_sections,
    }
  }
}

/**
 * Generate a tailored professional summary
 */
async function generateProfessionalSummary(
  baseInfo: BaseInformation,
  jobContext: string,
  mode: TailoringMode
): Promise<string> {
  const professionalTitle = baseInfo.personal_info?.professional_title || 'Professional'
  const experience = baseInfo.work_experience || []
  const skills = baseInfo.skills || { technical: [], soft: [] }

  // Build summary of user's background
  const userBackground = `
Professional Title: ${professionalTitle}
Years of Experience: ${experience.length} positions
Key Skills: ${[...(skills.technical || []), ...(skills.soft || [])].slice(0, 10).join(', ')}
Recent Roles: ${experience.slice(0, 3).map(exp => `${exp.job_title} at ${exp.company}`).join(', ')}
  `.trim()

  const systemPrompt = `You are an expert resume writer. Generate a professional summary that is truthful, compelling, and tailored to the job.`

  const userPrompt = mode === 'conservative'
    ? `Generate a 2-3 sentence professional summary that:
- Highlights relevant experience and skills for this job
- Uses some keywords from the job description naturally
- Stays truthful to the candidate's actual background
- Is professional and concise

Candidate Background:
${userBackground}

Target Job:
${jobContext}

Return ONLY the professional summary text, no JSON, no additional commentary.`
    : `Generate a 2-3 sentence professional summary that:
- Strongly emphasizes experience and skills relevant to this specific role
- Incorporates important keywords from the job description naturally
- Highlights achievements and strengths that match job requirements
- Stays completely truthful to the candidate's actual background
- Uses compelling, professional language

Candidate Background:
${userBackground}

Target Job:
${jobContext}

Return ONLY the professional summary text, no JSON, no additional commentary.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 300,
  })

  return completion.choices[0].message.content?.trim() || ''
}

/**
 * Tailor work experience bullets to match job requirements
 */
async function tailorWorkExperience(
  experiences: Array<{
    company: string
    job_title: string
    start_date: string
    end_date?: string
    is_current?: boolean
    location?: string
    responsibilities?: string[]
  }>,
  jobContext: string,
  mode: TailoringMode
): Promise<Array<{
  company: string
  job_title: string
  start_date: string
  end_date?: string
  is_current?: boolean
  location?: string
  responsibilities: string[]
}>> {
  const tailored = []

  for (const exp of experiences) {
    if (!exp.responsibilities || exp.responsibilities.length === 0) {
      // Keep as-is if no responsibilities
      tailored.push({
        ...exp,
        responsibilities: [],
      })
      continue
    }

    const systemPrompt = `You are an expert resume writer. Rewrite job responsibility bullet points to be more relevant to a target job while staying completely truthful.`

    const userPrompt = mode === 'conservative'
      ? `Rewrite these bullet points with MINOR improvements:
- Add relevant keywords where natural
- Improve clarity and impact
- Keep original meaning and facts
- Keep same number of bullets
- Stay truthful - don't add accomplishments that aren't there

Original Role: ${exp.job_title} at ${exp.company}
Original Bullets:
${exp.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Target Job:
${jobContext}

Return ONLY the rewritten bullets as a JSON array of strings, like: ["bullet 1", "bullet 2", ...]`
      : `Rewrite these bullet points to EMPHASIZE relevance to the target job:
- Highlight aspects most relevant to the target role
- Incorporate important keywords naturally
- Reframe responsibilities to show relevant skills
- Quantify where the original allows
- Keep same number of bullets
- Stay completely truthful - only reframe existing facts

Original Role: ${exp.job_title} at ${exp.company}
Original Bullets:
${exp.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Target Job:
${jobContext}

Return ONLY the rewritten bullets as a JSON array of strings, like: ["bullet 1", "bullet 2", ...]`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0].message.content
      if (content) {
        // Try to parse as JSON
        const parsed = JSON.parse(content)
        const bullets = parsed.bullets || parsed.responsibilities || Object.values(parsed)

        if (Array.isArray(bullets) && bullets.length > 0) {
          tailored.push({
            ...exp,
            responsibilities: bullets as string[],
          })
        } else {
          // Fallback to original
          tailored.push({
            ...exp,
            responsibilities: exp.responsibilities,
          })
        }
      } else {
        tailored.push({
          ...exp,
          responsibilities: exp.responsibilities,
        })
      }
    } catch (error) {
      console.error('Error tailoring experience:', error)
      // Fallback to original
      tailored.push({
        ...exp,
        responsibilities: exp.responsibilities,
      })
    }
  }

  return tailored
}

/**
 * Reorder skills to prioritize those matching the job description
 */
function optimizeSkills(
  skills: {
    technical?: string[]
    soft?: string[]
    languages?: Array<{ name: string; proficiency: string }>
    certifications?: Array<{ name: string; organization: string; date: string }>
  },
  jobDescription: ParsedJobDescription
): {
  technical: string[]
  soft: string[]
  languages?: Array<{ name: string; proficiency: string }>
  certifications?: Array<{ name: string; organization: string; date: string }>
} {
  const requiredTechnicalSkills = new Set(
    jobDescription.technical_skills.map(s => s.toLowerCase())
  )
  const requiredSoftSkills = new Set(
    jobDescription.soft_skills.map(s => s.toLowerCase())
  )
  const requiredTechnologies = new Set(
    jobDescription.technologies.map(t => t.toLowerCase())
  )

  // Score and reorder technical skills
  const technicalSkills = (skills.technical || []).map(skill => ({
    skill,
    score: calculateSkillScore(skill, requiredTechnicalSkills, requiredTechnologies),
  }))
  technicalSkills.sort((a, b) => b.score - a.score)

  // Score and reorder soft skills
  const softSkills = (skills.soft || []).map(skill => ({
    skill,
    score: requiredSoftSkills.has(skill.toLowerCase()) ? 1 : 0,
  }))
  softSkills.sort((a, b) => b.score - a.score)

  return {
    technical: technicalSkills.map(s => s.skill),
    soft: softSkills.map(s => s.skill),
    languages: skills.languages,
    certifications: skills.certifications,
  }
}

/**
 * Calculate relevance score for a skill
 */
function calculateSkillScore(
  skill: string,
  requiredSkills: Set<string>,
  requiredTechnologies: Set<string>
): number {
  const skillLower = skill.toLowerCase()

  // Exact match = highest priority
  if (requiredSkills.has(skillLower) || requiredTechnologies.has(skillLower)) {
    return 10
  }

  // Partial match = medium priority
  for (const required of [...requiredSkills, ...requiredTechnologies]) {
    if (skillLower.includes(required) || required.includes(skillLower)) {
      return 5
    }
  }

  // No match = lowest priority
  return 0
}

/**
 * Optimize project descriptions to emphasize relevant technologies and achievements
 */
async function optimizeProjects(
  projects: Array<{
    name: string
    description: string
    technologies?: string[]
    link?: string
  }>,
  jobContext: string,
  mode: TailoringMode
): Promise<Array<{
  name: string
  description: string
  technologies?: string[]
  link?: string
}>> {
  if (mode === 'conservative' || projects.length === 0) {
    // Conservative mode doesn't rewrite projects, just returns them
    return projects
  }

  const optimized = []

  for (const project of projects.slice(0, 3)) { // Limit to top 3 projects
    const systemPrompt = `You are an expert resume writer. Rewrite project descriptions to emphasize relevance while staying truthful.`

    const userPrompt = `Rewrite this project description to emphasize aspects relevant to the target job:
- Highlight relevant technologies and skills
- Emphasize achievements that match job requirements
- Keep it concise (2-3 sentences max)
- Stay completely truthful

Original Project:
Name: ${project.name}
Description: ${project.description}
Technologies: ${project.technologies?.join(', ') || 'Not specified'}

Target Job:
${jobContext}

Return ONLY the rewritten description text, no JSON, no additional commentary.`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 200,
      })

      const newDescription = completion.choices[0].message.content?.trim()

      optimized.push({
        ...project,
        description: newDescription || project.description,
      })
    } catch (error) {
      console.error('Error optimizing project:', error)
      optimized.push(project)
    }
  }

  return optimized
}
