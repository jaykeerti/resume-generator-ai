# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered resume generator that tailors resumes based on job descriptions using Claude API. Features a freemium model with 5 free resume generations, then a paid Pro tier. Full specification at `Readme.md`.

## Tech Stack

- **Frontend/Backend:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode enabled)
- **Styling:** Tailwind CSS v4
- **Planned Integrations:**
  - Database: Supabase (PostgreSQL)
  - Auth: Supabase Auth (email/password + Google OAuth)
  - AI: Claude API (Anthropic)
  - Payments: Stripe
  - PDF Generation: `@react-pdf/renderer` or `puppeteer`
  - Hosting: Vercel

## Development Commands

### Development
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)

## Project Structure

```
resume-generator-ai/
├── app/                       # Next.js App Router pages & layouts
│   ├── auth/                  # Authentication pages (signin, signup, callback)
│   ├── dashboard/             # User dashboard
│   ├── onboarding/            # 5-step onboarding wizard
│   ├── profile/               # Profile editing page ✨ NEW
│   ├── api/                   # API routes
│   │   └── profile/           # Profile update endpoints ✨ NEW
│   ├── layout.tsx             # Root layout with font configuration
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global Tailwind styles
├── components/
│   ├── auth/                  # Authentication forms
│   ├── dashboard/             # Dashboard components
│   ├── onboarding/            # Onboarding wizard & steps
│   └── profile/               # Profile editing components ✨ NEW
│       └── editors/           # Individual section editors
├── lib/
│   ├── auth/                  # Auth server actions
│   ├── supabase/              # Supabase client configs
│   └── types/                 # TypeScript type definitions
├── hooks/                     # React hooks (useAuth)
├── supabase/
│   └── migrations/            # Database schema migrations
└── public/                    # Static assets
```

## Planned Architecture (See Readme.md for full details)

### Core User Flows
1. **Onboarding:** Multi-step form capturing personal info, work experience, education, skills, and optional sections (projects, volunteer work, etc.)
2. **Resume Generation:**
   - User pastes job description
   - Claude API parses job description to extract keywords/skills
   - AI tailors resume sections (summary, experience, skills) to match job
   - User reviews/edits generated content
   - Select from 3+ templates
   - Export to PDF
3. **Tier System:** Track generation count, enforce 5-generation free limit, upgrade flow to Pro

### Database Schema (Supabase)
Key tables to implement:
- `users_profile` - generation count, subscription tier, onboarding status
- `base_information` - user's raw resume data (JSONB)
- `job_descriptions` - saved job postings with parsed keywords
- `resumes` - generated resume versions with content snapshots
- `ai_section_config` - configurable AI prompts per resume section
- `subscription_history` - Stripe subscription tracking

### API Routes

**Implemented:**
```
✅ /api/profile/personal      # Update personal information
✅ /api/profile/experience    # Update work experience
✅ /api/profile/education     # Update education
✅ /api/profile/skills        # Update skills
```

**To be implemented:**
```
/api/auth/*                  # Authentication endpoints (Supabase handles most)
/api/job-description/parse   # Parse job posting with Claude
/api/resume/generate         # Generate tailored resume
/api/resume/[id]             # CRUD operations on resumes
/api/resume/[id]/export      # PDF generation
/api/subscription/*          # Stripe integration
/api/webhook/stripe          # Stripe webhooks
```

### AI Integration Strategy
- Store AI prompt templates in database (`ai_section_config` table) for easy iteration
- AI processes sections independently: professional summary, work experience bullets, skills reordering, project descriptions
- Preserve truthfulness - AI enhances/rewords existing content, never fabricates
- Target: Resume generation completes in <30 seconds

## Key Considerations

### Security
- Implement proper input validation for all user data
- Sanitize AI-generated content before storage/display
- Secure Stripe webhook validation
- Row-level security (RLS) in Supabase for all user data
- Rate limiting on AI API calls

### Performance
- Cache parsed job descriptions to reduce Claude API calls
- Optimize PDF generation (consider pre-rendering templates)
- Implement proper database indexing (user_id, created_at)
- Use Next.js Image optimization for template previews

### Free Tier Management
- Atomic increment of generation counter to prevent race conditions
- Clear UI feedback on remaining generations
- Graceful upgrade prompts when limit reached

### Template System
MVP templates (ATS-friendly):
1. Classic - Single-column traditional
2. Modern - Two-column with accent color
3. Minimal - Clean with whitespace

All templates must avoid:
- Complex tables
- Graphics/images (except simple borders/dividers)
- Unusual fonts

## Development Phases (from Readme.md)

**Completed Phases:**

✅ **Phase 1 - Foundation** (Complete)
- Next.js + Supabase + Vercel setup
- Authentication (email/password + Google OAuth)
- Database schema with RLS policies
- 5-step onboarding wizard
- User dashboard with tier management
- Landing page

✅ **Phase 1.5 - Profile Editing** (Complete) ✨ NEW
- `/profile` page with tabbed interface
- Edit personal information
- Manage work experience (add/edit/delete)
- Manage education (add/edit/delete)
- Manage skills (tag-based UI)
- API endpoints for profile updates

**Next Phases:**
- Phase 2: AI Integration (Claude API for job description parsing)
- Phase 3: Resume Generation (AI-tailored content)
- Phase 4: Resume Editor (live preview, templates)
- Phase 5: PDF Export
- Phase 6: Stripe Payments

## Configuration Files

- `tsconfig.json` - TypeScript strict mode, JSX transform: react-jsx
- `next.config.ts` - Next.js configuration (currently default)
- `eslint.config.mjs` - ESLint with Next.js rules
- `postcss.config.mjs` - PostCSS with Tailwind v4

## Environment Variables (to be configured)

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```
