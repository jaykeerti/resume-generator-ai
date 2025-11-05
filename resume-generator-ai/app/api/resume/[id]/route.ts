import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Fetch a specific resume
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns this resume
      .single()

    if (error || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, resume })
  } catch (error) {
    console.error('Error fetching resume:', error)
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}

// PUT - Update a resume
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    // Validate allowed fields
    const allowedFields = ['title', 'template_id', 'content', 'customization', 'job_description_id']
    const updateData: Record<string, any> = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Verify ownership and update
    const { data: resume, error } = await supabase
      .from('resumes')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns this resume
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Resume not found or unauthorized' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ success: true, resume })
  } catch (error) {
    console.error('Error updating resume:', error)
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 })
  }
}

// DELETE - Delete a resume
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns this resume

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resume:', error)
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 })
  }
}
