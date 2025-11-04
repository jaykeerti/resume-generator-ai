"""
AI Structurer Service
Uses Claude API to structure parsed resume text into structured data
"""

import json
import logging
from typing import Optional, Dict, Any
from anthropic import AsyncAnthropic

from app.models.schemas import StructuredResumeData

logger = logging.getLogger(__name__)


class AIStructurer:
    """Service for structuring resume text using Claude AI"""

    def __init__(self, api_key: str):
        """
        Initialize AI structurer with Anthropic API key

        Args:
            api_key: Anthropic API key
        """
        if not api_key:
            logger.warning("Anthropic API key not provided. AI structuring will not be available.")
            self.client = None
        else:
            self.client = AsyncAnthropic(api_key=api_key)

    async def structure_resume(self, raw_text: str) -> Optional[StructuredResumeData]:
        """
        Structure raw resume text into organized sections using Claude AI

        Args:
            raw_text: Raw extracted text from resume

        Returns:
            StructuredResumeData object or None if structuring fails
        """
        if not self.client:
            logger.warning("AI client not initialized. Returning dummy data.")
            return self._get_dummy_structured_data()

        try:
            prompt = self._build_structuring_prompt(raw_text)

            response = await self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4096,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            # Extract JSON from response
            response_text = response.content[0].text

            # Parse JSON response
            structured_json = self._extract_json(response_text)

            if not structured_json:
                logger.error("Failed to extract valid JSON from Claude response")
                return None

            # Convert to Pydantic model
            structured_data = StructuredResumeData(**structured_json)

            logger.info("Successfully structured resume with AI")
            return structured_data

        except Exception as e:
            logger.error(f"Error structuring resume with AI: {str(e)}", exc_info=True)
            return None

    def _build_structuring_prompt(self, raw_text: str) -> str:
        """
        Build the prompt for Claude to structure the resume

        Args:
            raw_text: Raw resume text

        Returns:
            Formatted prompt string
        """
        return f"""You are a resume parsing expert. Extract and structure the following resume text into a JSON format.

Resume Text:
{raw_text}

Extract the following information and return ONLY valid JSON (no markdown, no explanations):

{{
  "personal_info": {{
    "full_name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, State",
    "linkedin": "linkedin.com/in/username",
    "portfolio": "portfolio-url",
    "github": "github.com/username"
  }},
  "professional_summary": "Brief professional summary or objective statement",
  "work_experience": [
    {{
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "start_date": "MM/YYYY",
      "end_date": "MM/YYYY or Present",
      "description": "Brief role description",
      "responsibilities": ["Achievement/responsibility 1", "Achievement 2"]
    }}
  ],
  "education": [
    {{
      "institution": "University Name",
      "degree": "Degree Type",
      "field_of_study": "Major/Field",
      "location": "City, State",
      "start_date": "YYYY",
      "end_date": "YYYY",
      "gpa": "GPA if mentioned",
      "achievements": ["Achievement 1", "Achievement 2"]
    }}
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "certifications": ["Certification 1", "Certification 2"],
  "projects": [
    {{
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["Tech 1", "Tech 2"],
      "url": "project-url if available"
    }}
  ],
  "languages": ["English (Native)", "Spanish (Fluent)"],
  "volunteer_work": [
    {{
      "organization": "Organization Name",
      "role": "Role",
      "date": "YYYY or date range",
      "description": "What you did"
    }}
  ]
}}

Rules:
1. Extract information as accurately as possible from the provided text
2. Use null for missing fields
3. Use empty arrays [] for missing list fields
4. Preserve the exact formatting and content from the resume
5. For dates, use the format provided in the resume
6. Return ONLY the JSON object, no other text
7. Ensure all JSON is valid and properly escaped"""

    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Extract and parse JSON from Claude's response

        Args:
            text: Response text that may contain JSON

        Returns:
            Parsed JSON dict or None if extraction fails
        """
        try:
            # Try to parse directly first
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code block
            if "```json" in text:
                json_start = text.find("```json") + 7
                json_end = text.find("```", json_start)
                json_str = text[json_start:json_end].strip()
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError:
                    pass

            # Try to find JSON between curly braces
            if "{" in text and "}" in text:
                json_start = text.find("{")
                json_end = text.rfind("}") + 1
                json_str = text[json_start:json_end]
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError:
                    pass

            logger.error(f"Could not extract valid JSON from text: {text[:200]}...")
            return None

    def _get_dummy_structured_data(self) -> StructuredResumeData:
        """
        Return dummy structured data when AI is not available

        Returns:
            Sample StructuredResumeData object
        """
        return StructuredResumeData(
            personal_info={
                "full_name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+1 (555) 123-4567",
                "location": "San Francisco, CA",
                "linkedin": "linkedin.com/in/johndoe",
                "portfolio": "johndoe.dev",
                "github": "github.com/johndoe"
            },
            professional_summary="Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of building scalable applications and leading technical teams.",
            work_experience=[
                {
                    "company": "Tech Corp",
                    "position": "Senior Software Engineer",
                    "location": "San Francisco, CA",
                    "start_date": "01/2021",
                    "end_date": "Present",
                    "description": "Lead development of core platform features",
                    "responsibilities": [
                        "Led a team of 5 engineers in developing a scalable microservices architecture",
                        "Reduced API response time by 40% through optimization and caching strategies",
                        "Implemented CI/CD pipelines that decreased deployment time by 60%"
                    ]
                },
                {
                    "company": "Startup Inc",
                    "position": "Software Engineer",
                    "location": "San Francisco, CA",
                    "start_date": "06/2019",
                    "end_date": "12/2020",
                    "description": "Full-stack development for web applications",
                    "responsibilities": [
                        "Built responsive web applications using React and Node.js",
                        "Developed RESTful APIs serving 10,000+ daily active users",
                        "Collaborated with design team to implement pixel-perfect UI components"
                    ]
                }
            ],
            education=[
                {
                    "institution": "University of California, Berkeley",
                    "degree": "Bachelor of Science",
                    "field_of_study": "Computer Science",
                    "location": "Berkeley, CA",
                    "start_date": "2015",
                    "end_date": "2019",
                    "gpa": "3.8",
                    "achievements": [
                        "Dean's List all semesters",
                        "President of Computer Science Club"
                    ]
                }
            ],
            skills=[
                "JavaScript", "TypeScript", "React", "Node.js", "Python",
                "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB",
                "Git", "CI/CD", "Agile/Scrum"
            ],
            certifications=[
                "AWS Certified Solutions Architect",
                "Google Cloud Professional Developer"
            ],
            projects=[
                {
                    "name": "E-commerce Platform",
                    "description": "Built a full-stack e-commerce platform with payment integration",
                    "technologies": ["React", "Node.js", "Stripe", "PostgreSQL"],
                    "url": "github.com/johndoe/ecommerce"
                },
                {
                    "name": "Task Management App",
                    "description": "Real-time collaborative task management application",
                    "technologies": ["React", "Firebase", "Material-UI"],
                    "url": "github.com/johndoe/taskapp"
                }
            ],
            languages=["English (Native)", "Spanish (Professional)"],
            volunteer_work=[
                {
                    "organization": "Code for Good",
                    "role": "Volunteer Developer",
                    "date": "2020-Present",
                    "description": "Develop web applications for non-profit organizations"
                }
            ]
        )
