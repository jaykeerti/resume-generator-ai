/**
 * Next.js API Route - Resume Parser Proxy
 * Proxies resume parsing requests to FastAPI backend
 */

import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Log FASTAPI_URL for debugging
    console.log('[parse-resume] FASTAPI_URL:', FASTAPI_URL);

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const structureWithAI = formData.get('structure_with_ai') !== 'false'; // Default true

    console.log('[parse-resume] Received file:', file?.name, 'size:', file?.size, 'type:', file?.type);

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

    const backendUrl = `${FASTAPI_URL}/api/parse-resume`;
    console.log('[parse-resume] Forwarding to FastAPI:', backendUrl);

    // Forward request to FastAPI backend
    const fastapiResponse = await fetch(backendUrl, {
      method: 'POST',
      body: fastapiFormData,
    });

    console.log('[parse-resume] FastAPI response status:', fastapiResponse.status);

    if (!fastapiResponse.ok) {
      const errorData = await fastapiResponse.json().catch(() => ({}));
      console.error('[parse-resume] FastAPI error:', errorData);
      return NextResponse.json(
        {
          error: errorData.detail || 'Failed to parse resume',
          status: fastapiResponse.status,
          backendUrl: FASTAPI_URL // Include for debugging
        },
        { status: fastapiResponse.status }
      );
    }

    const data = await fastapiResponse.json();
    console.log('[parse-resume] Successfully parsed resume');
    return NextResponse.json(data);

  } catch (error) {
    console.error('[parse-resume] Error in API route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error while processing resume',
        details: error instanceof Error ? error.message : 'Unknown error',
        fastapi_url: FASTAPI_URL // Include for debugging
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
