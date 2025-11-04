"""
FastAPI Backend for Resume Document Parsing
Handles PDF, DOCX, and TXT resume parsing with Claude AI structuring
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from typing import Optional
import logging

from app.services.document_parser import DocumentParser
from app.services.ai_structurer import AIStructurer
from app.models.schemas import ParsedResumeResponse, HealthResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Resume Parser API",
    description="API for parsing and structuring resume documents",
    version="1.0.0"
)

# CORS configuration - will be restricted to Next.js origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("NEXTJS_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Initialize services
document_parser = DocumentParser()
ai_structurer = AIStructurer(api_key=os.getenv("ANTHROPIC_API_KEY"))


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Resume Parser API is running",
        "version": "1.0.0"
    }


@app.post("/api/parse-resume", response_model=ParsedResumeResponse)
async def parse_resume(
    file: UploadFile = File(...),
    structure_with_ai: bool = True
):
    """
    Parse uploaded resume document (PDF, DOCX, TXT)

    Args:
        file: Uploaded resume file
        structure_with_ai: Whether to use Claude AI to structure the parsed content

    Returns:
        ParsedResumeResponse with structured resume data
    """
    try:
        # Validate file type
        allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]
        allowed_extensions = [".pdf", ".docx", ".txt"]

        file_ext = os.path.splitext(file.filename)[1].lower()

        if file.content_type not in allowed_types and file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed types: PDF, DOCX, TXT. Got: {file.content_type}"
            )

        # Read file content
        content = await file.read()

        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        # Limit file size to 10MB
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")

        logger.info(f"Parsing file: {file.filename} ({file.content_type})")

        # Parse document to extract raw text
        raw_text = document_parser.parse(content, file.filename)

        if not raw_text or len(raw_text.strip()) < 50:
            raise HTTPException(
                status_code=422,
                detail="Could not extract sufficient text from document. Please ensure the file contains readable text."
            )

        # Structure with AI if requested
        structured_data = None
        if structure_with_ai:
            logger.info("Structuring content with Claude AI")
            structured_data = await ai_structurer.structure_resume(raw_text)

        return {
            "success": True,
            "filename": file.filename,
            "raw_text": raw_text,
            "structured_data": structured_data,
            "message": "Resume parsed successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse resume: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Detailed health check with service status"""
    anthropic_configured = bool(os.getenv("ANTHROPIC_API_KEY"))

    return {
        "status": "healthy",
        "services": {
            "document_parser": "ready",
            "ai_structurer": "ready" if anthropic_configured else "not_configured"
        }
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
