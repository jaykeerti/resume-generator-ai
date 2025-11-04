/**
 * Next.js API Route - Resume Parser Proxy
 * Proxies resume parsing requests to FastAPI backend
 */

import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const structureWithAI = formData.get('structure_with_ai') !== 'false'; // Default true

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, DOCX, or TXT files only.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Create new FormData for FastAPI request
    const fastapiFormData = new FormData();
    fastapiFormData.append('file', file);
    fastapiFormData.append('structure_with_ai', structureWithAI.toString());

    // Forward request to FastAPI backend
    const fastapiResponse = await fetch(`${FASTAPI_URL}/api/parse-resume`, {
      method: 'POST',
      body: fastapiFormData,
    });

    if (!fastapiResponse.ok) {
      const errorData = await fastapiResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.detail || 'Failed to parse resume',
          status: fastapiResponse.status
        },
        { status: fastapiResponse.status }
      );
    }

    const data = await fastapiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in parse-resume API route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error while processing resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const healthResponse = await fetch(`${FASTAPI_URL}/health`, {
      method: 'GET',
    });

    if (!healthResponse.ok) {
      return NextResponse.json(
        { status: 'unhealthy', message: 'FastAPI backend is not responding' },
        { status: 503 }
      );
    }

    const healthData = await healthResponse.json();
    return NextResponse.json({
      status: 'healthy',
      backend: healthData
    });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        message: 'Cannot connect to FastAPI backend',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
