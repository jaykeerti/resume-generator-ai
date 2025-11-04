# Setup Guide - Resume Generator AI

This guide will walk you through setting up the development environment for the Resume Generator AI application.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- An Anthropic API key (for Claude AI)

## Step 1: Clone and Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **Project Settings** → **API** to find your credentials:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

## Step 3: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the migrations in order:
   - Copy contents of `supabase/migrations/20250104000001_initial_schema.sql`
   - Click "Run" to execute
   - Copy contents of `supabase/migrations/20250104000002_seed_ai_config.sql`
   - Click "Run" to execute

3. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `users_profile`, `base_information`, `job_descriptions`, `resumes`, `ai_section_config`, `subscription_history`

## Step 4: Configure Google OAuth (Optional)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable Google provider
3. Follow Supabase instructions to set up Google OAuth:
   - Create a Google Cloud project
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Supabase
   - Copy Client ID and Client Secret to Supabase

## Step 5: Get Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to **Settings** → **API Keys**
4. Create a new API key
5. Copy the key (you won't be able to see it again!)

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your values:
   ```bash
   # From Supabase Project Settings → API
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # From Anthropic Console
   ANTHROPIC_API_KEY=your_anthropic_api_key

   # Local development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 7: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Testing the Setup

1. Navigate to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create an account with email/password
4. You should be redirected to the onboarding flow
5. Complete the onboarding (fill in at least the required fields)
6. You should land on the dashboard

## Troubleshooting

### "Invalid API key" errors
- Double-check your API keys in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart the dev server after changing environment variables

### Database errors
- Verify migrations ran successfully in Supabase SQL Editor
- Check that RLS (Row Level Security) policies were created
- Verify the trigger for auto-creating user profiles exists

### Authentication not working
- Check Supabase URL and keys are correct
- Verify email confirmation is disabled in Supabase (for development)
  - Go to **Authentication** → **Providers** → **Email**
  - Turn off "Confirm email"

### Google OAuth not working
- Ensure redirect URL in Google Cloud Console matches Supabase
- Verify Google provider is enabled in Supabase
- Check that Client ID and Secret are correctly entered

## Next Steps

Now that your development environment is set up, you can:

1. **Phase 3**: Implement Claude API integration for job description parsing
2. **Phase 4**: Build the resume editor with live preview
3. **Phase 5**: Add PDF export functionality
4. **Phase 6**: Integrate Stripe for payments

See `Readme.md` for the full development roadmap and feature specifications.

## Project Structure

```
resume-generator-ai/
├── app/                          # Next.js App Router
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # User dashboard
│   ├── onboarding/              # Onboarding flow
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── auth/                    # Auth forms
│   ├── dashboard/               # Dashboard components
│   └── onboarding/              # Onboarding wizard
├── lib/                         # Utilities and configurations
│   ├── auth/                    # Auth server actions
│   ├── supabase/                # Supabase clients
│   └── types/                   # TypeScript types
├── hooks/                       # React hooks
├── supabase/
│   └── migrations/              # Database migrations
└── .env.local                   # Environment variables (create this)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the main `Readme.md` for architecture details
- Check Supabase and Anthropic documentation
