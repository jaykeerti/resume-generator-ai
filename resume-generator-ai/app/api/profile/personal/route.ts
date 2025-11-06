import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const personalInfo = await request.json()

    console.log('[personal/route] Updating personal info for user:', user.id)
    console.log('[personal/route] Data:', personalInfo)

    const { data, error } = await supabase
      .from('base_information')
      .update({ personal_info: personalInfo })
      .eq('user_id', user.id)
      .select()

    if (error) {
      console.error('[personal/route] Database error:', error)
      throw error
    }

    console.log('[personal/route] Update successful:', data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[personal/route] Error updating personal info:', error)
    return NextResponse.json({
      error: 'Failed to update',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
