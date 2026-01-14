export const isLocalSupabase = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost') ||
         process.env.SUPABASE_ENV === 'local'
}

export const getSupabaseConfig = () => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    isLocal: isLocalSupabase(),
    shouldOptimizeConnection: !isLocalSupabase()
  }
}
