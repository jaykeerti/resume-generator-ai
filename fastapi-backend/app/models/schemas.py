"""
Pydantic models for request/response schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str
    version: str


class PersonalInfo(BaseModel):
    """Structured personal information"""
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    github: Optional[str] = None


class WorkExperience(BaseModel):
    """Structured work experience entry"""
    company: str
    position: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    responsibilities: List[str] = Field(default_factory=list)


class Education(BaseModel):
    """Structured education entry"""
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    achievements: List[str] = Field(default_factory=list)


class StructuredResumeData(BaseModel):
    """Complete structured resume data"""
    personal_info: Optional[PersonalInfo] = None
    professional_summary: Optional[str] = None
    work_experience: List[WorkExperience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    volunteer_work: List[Dict[str, Any]] = Field(default_factory=list)


class ParsedResumeResponse(BaseModel):
    """Response model for parsed resume"""
    success: bool
    filename: str
    raw_text: str
    structured_data: Optional[StructuredResumeData] = None
    message: str
