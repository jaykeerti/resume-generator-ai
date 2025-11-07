import OpenAI from 'openai'

// Initialize OpenAI client
// Make sure OPENAI_API_KEY is set in .env.local
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface ParsedJobDescription {
  job_title: string
  company: string
  location: string
  experience_required: string
  technical_skills: string[]
  soft_skills: string[]
  qualifications: string[]
  responsibilities: string[]
  technologies: string[]
  keywords: string[]
  raw_text: string
}

/**
 * Detects if input is a URL or plain text
 */
function isUrl(input: string): boolean {
  try {
    new URL(input.trim())
    return true
  } catch {
    return false
  }
}

/**
 * Fetches job description from URL
 * Falls back to returning original text if fetch fails
 */
async function fetchJobDescription(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch URL: ${response.status}`)
      return url // Fallback to treating as text
    }

    const html = await response.text()

    // Extract text from HTML (simple approach - remove tags)
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return text
  } catch (error) {
    console.error('Error fetching job description from URL:', error)
    return url // Fallback
  }
}

/**
 * Parses job description text with OpenAI to extract structured data
 */
export async function parseJobDescription(
  input: string
): Promise<ParsedJobDescription> {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in .env.local')
    }

    // Check if input is URL and fetch content
    const isInputUrl = isUrl(input)
    let jobDescriptionText = input

    if (isInputUrl) {
      console.log('Detected URL, fetching content...')
      jobDescriptionText = await fetchJobDescription(input)
    }

    // Parse with OpenAI
    const systemPrompt = `You are an expert at analyzing job descriptions. Extract key information from job postings and return structured data in JSON format.`

    const userPrompt = `Analyze this job description and extract the following information in JSON format:

{
  "job_title": "The job title/position",
  "company": "Company name (if mentioned, otherwise empty string)",
  "location": "Job location (if mentioned, otherwise empty string)",
  "experience_required": "Required years of experience (e.g., '3-5 years', '5+ years')",
  "technical_skills": ["List of technical skills required"],
  "soft_skills": ["List of soft skills required"],
  "qualifications": ["Education, certifications, and other qualifications"],
  "responsibilities": ["Key job responsibilities"],
  "technologies": ["Specific tools, frameworks, languages, platforms mentioned"],
  "keywords": ["Important keywords and phrases for ATS matching"]
}

Job Description:
${jobDescriptionText}

Return ONLY valid JSON without any markdown formatting or code blocks.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0].message.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(responseContent) as ParsedJobDescription

    // Add raw text to result
    parsed.raw_text = jobDescriptionText.substring(0, 5000) // Limit to 5k chars

    return parsed
  } catch (error) {
    console.error('Error parsing job description:', error)

    // Return minimal fallback structure
    return {
      job_title: 'Unknown Position',
      company: '',
      location: '',
      experience_required: '',
      technical_skills: [],
      soft_skills: [],
      qualifications: [],
      responsibilities: [],
      technologies: [],
      keywords: [],
      raw_text: input.substring(0, 5000),
    }
  }
}
