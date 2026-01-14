import { createClient } from '@supabase/supabase-js'

// Read from command line args or use defaults
const email = process.argv[2] || 'test@example.com'
const password = process.argv[3] || 'test123456'

// Local Supabase URL and service role key
const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  console.log(`Creating test user with email: ${email}`)

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Test User'
    }
  })

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('already been registered')) {
      console.log(`✓ User ${email} already exists`)

      // Get user ID
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users.users.find(u => u.email === email)

      if (existingUser) {
        console.log(`User ID: ${existingUser.id}`)
      }
    } else {
      console.error('Error creating user:', error.message)
    }
    return
  }

  console.log('\n✓ Test user created successfully!')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  console.log(`User ID: ${data.user.id}`)
  console.log('\nYou can now sign in at http://localhost:3000')
}

createTestUser().catch(console.error)
