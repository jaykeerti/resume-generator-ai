-- Seed AI Section Configuration with prompt templates
INSERT INTO ai_section_config (section_name, ai_enabled, ai_prompt_template, processing_priority, user_editable) VALUES
(
  'professional_summary',
  true,
  'Analyze this job description:
{job_description}

User''s background:
- Current role: {professional_title}
- Key experience areas: {experience_summary}
- Top skills: {top_skills}

Create a compelling 2-3 sentence professional summary that:
1. Highlights experience most relevant to this job
2. Uses similar language and keywords from the job posting
3. Remains truthful to the user''s actual background
4. Uses strong, active language
5. Positions the candidate as an ideal fit

Return only the summary text, no additional commentary.',
  1,
  true
),
(
  'work_experience',
  true,
  'Analyze this job description:
{job_description}

User''s original work experience entry:
Company: {company}
Role: {role}
Dates: {dates}
Original bullet points:
{original_bullets}

Rewrite the bullet points to:
1. Emphasize skills/experience matching the job requirements
2. Use similar keywords and action verbs from the job posting
3. Keep all information truthful (don''t add fake achievements)
4. Use strong action verbs (Led, Implemented, Developed, etc.)
5. Quantify results where the original content provides numbers
6. Make impact clear and specific

Return 3-5 optimized bullet points in markdown list format.',
  2,
  true
),
(
  'skills',
  true,
  'Analyze this job description:
{job_description}

User''s complete skill set:
Technical: {technical_skills}
Soft skills: {soft_skills}
Languages: {languages}
Certifications: {certifications}

Organize and prioritize these skills:
1. Place skills mentioned in the job description first
2. Group related skills together logically
3. Remove skills not relevant to this position
4. Keep the list focused (top 10-15 skills)
5. Use exact terminology from the job posting where applicable

Return a JSON object with structure:
{
  "technical": ["skill1", "skill2", ...],
  "soft": ["skill1", "skill2", ...],
  "languages": [{"name": "Language", "proficiency": "Level"}],
  "certifications": [{"name": "Cert", "org": "Org", "date": "Date"}]
}',
  3,
  true
),
(
  'projects',
  true,
  'Analyze this job description:
{job_description}

User''s project:
Title: {project_title}
Description: {project_description}
Technologies: {technologies}
Link: {link}

Rewrite the project description to:
1. Highlight aspects most relevant to the job requirements
2. Emphasize technologies/skills mentioned in the job posting
3. Show measurable impact or results where available
4. Keep it concise (2-3 sentences)
5. Use technical terminology that matches the job description

Return only the rewritten description.',
  4,
  true
);
