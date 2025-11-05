import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateResumePDF } from '@/lib/pdf/generator'

// Disable caching and set max duration
export const dynamic = 'force-dynamic'
export const maxDuration = 60

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to check subscription tier and generation count
    const { data: profile, error: profileError } = await supabase
      .from('users_profile')
      .select('subscription_tier, generation_count')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check generation limit for free tier
    if (profile.subscription_tier === 'free' && profile.generation_count >= 5) {
      return NextResponse.json(
        {
          error: 'Generation limit reached',
          message: 'You have reached your limit of 5 resume exports. Upgrade to Pro for unlimited exports.',
          limit_reached: true
        },
        { status: 403 }
      )
    }

    // Fetch resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Determine if watermark should be added
    const addWatermark = profile.subscription_tier === 'free'

    // Generate PDF
    const pdfBuffer = await generateResumePDF({
      resume,
      addWatermark,
    })

    // Increment generation count for free tier
    if (profile.subscription_tier === 'free') {
      await supabase
        .from('users_profile')
        .update({ generation_count: profile.generation_count + 1 })
        .eq('id', user.id)
    }

    // Return PDF
    const uint8Array = new Uint8Array(pdfBuffer)

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack',
      name: error instanceof Error ? error.name : 'Unknown',
    })
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : undefined
      },
      { status: 500 }
    )
  }
}
