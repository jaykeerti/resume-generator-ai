import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Fetch profile and resumes in parallel for better performance
  const [profileResult, resumesResult] = await Promise.all([
    supabase
      .from('users_profile')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
  ])

  const profile = profileResult.data
  const resumes = resumesResult.data

  // Redirect to onboarding if not completed
  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  return <DashboardContent user={user} profile={profile} resumes={resumes || []} />
}
