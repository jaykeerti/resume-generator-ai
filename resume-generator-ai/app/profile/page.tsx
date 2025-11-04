import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileEditor } from '@/components/profile/ProfileEditor'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Get user's base information
  const { data: baseInfo } = await supabase
    .from('base_information')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!baseInfo) {
    redirect('/onboarding')
  }

  return <ProfileEditor baseInfo={baseInfo} userId={user.id} />
}
