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
            logger.warning("AI client not initialized. Skipping structuring.")
            return None

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
