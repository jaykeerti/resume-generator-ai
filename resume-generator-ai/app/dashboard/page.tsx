import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Fetch profile, base information, and resumes with job descriptions in parallel for better performance
  const [profileResult, baseInfoResult, resumesResult] = await Promise.all([
    supabase
      .from('users_profile')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('base_information')
      .select('*')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('resumes')
      .select(`
        *,
        job_description:job_descriptions(
          id,
          job_title,
          company_name,
          description_text,
          parsed_keywords
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
  ])

  const profile = profileResult.data
  const baseInfo = baseInfoResult.data
  const resumes = resumesResult.data

  // Redirect to onboarding if not completed
  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  return <DashboardContent user={user} profile={profile} baseInfo={baseInfo} resumes={resumes || []} />
}
