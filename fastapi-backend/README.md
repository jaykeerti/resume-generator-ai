# FastAPI Resume Parser Backend

FastAPI backend service for parsing resume documents (PDF, DOCX, TXT) and structuring content using Claude AI.

## Features

- **Document Parsing**: Extract text from PDF, DOCX, and TXT files
- **AI Structuring**: Use Claude API to structure parsed content into organized sections
- **Type Safety**: Full Pydantic validation for request/response
- **CORS Support**: Configured for Next.js frontend integration

## Setup

### 1. Create Virtual Environment

```bash
cd fastapi-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=8000
NEXTJS_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_actual_api_key
```

### 4. Run Development Server

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /
GET /health
```

### Parse Resume
```
POST /api/parse-resume
Content-Type: multipart/form-data

Parameters:
- file: File (PDF, DOCX, or TXT)
- structure_with_ai: boolean (default: true)

Response:
{
  "success": true,
  "filename": "resume.pdf",
  "raw_text": "Extracted text...",
  "structured_data": {
    "personal_info": {...},
    "work_experience": [...],
    "education": [...],
    "skills": [...],
    ...
  },
  "message": "Resume parsed successfully"
}
```

## Project Structure

```
fastapi-backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── app/
│   ├── models/
│   │   └── schemas.py     # Pydantic models
│   └── services/
│       ├── document_parser.py   # Document parsing service
│       └── ai_structurer.py     # Claude AI integration
```

## Integration with Next.js

The FastAPI backend is accessed via Next.js API routes (see `/app/api/parse-resume/route.ts`).

This provides:
- Secure API key handling (not exposed to client)
- Unified authentication layer
- Centralized error handling

## Development

### Running Tests (Coming Soon)
```bash
pytest
```

### Code Formatting
```bash
black .
isort .
```

### Type Checking
```bash
mypy .
```

## Supported File Types

- **PDF** (.pdf): Uses PyPDF for text extraction
- **DOCX** (.docx): Uses python-docx for Word document parsing
- **TXT** (.txt): Direct text file reading with UTF-8/Latin-1 encoding

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Invalid file type or empty file
- `422`: Unable to extract text from document
- `500`: Server error during processing

## License

Part of the Resume Generator AI project.
