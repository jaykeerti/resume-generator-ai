import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Agent, setGlobalDispatcher } from 'undici'
import { setDefaultResultOrder } from 'dns'

// Configure DNS to prioritize IPv4 addresses
setDefaultResultOrder('ipv4first')

// Configure Undici with increased timeout to prevent connection timeout errors
setGlobalDispatcher(new Agent({ connect: { timeout: 20000 } }))

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
