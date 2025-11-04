# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered resume generator that tailors resumes based on job descriptions using Claude API. Features a freemium model with 5 free resume generations, then a paid Pro tier. Full specification at `Readme.md`.

## Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Backend:** FastAPI (Python) for document parsing
- **Language:** TypeScript (strict mode enabled) + Python 3.11+
- **Styling:** Tailwind CSS v4
- **Integrations:**
  - Database: Supabase (PostgreSQL)
  - Auth: Supabase Auth (email/password + Google OAuth)
  - AI: Claude API (Anthropic) - used in both Next.js and FastAPI
  - Document Parsing: PyPDF (PDF), python-docx (DOCX)
  - Payments: Stripe (planned)
  - PDF Generation: `@react-pdf/renderer` or `puppeteer` (planned)
  - Hosting: Vercel (Next.js) + FastAPI deployment

## Development Commands

### Quick Start (Both Services)
```bash
./dev.sh             # Start both Next.js (port 3000) and FastAPI (port 8000)
```

### Individual Services

**Next.js Frontend:**
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
```

**FastAPI Backend:**
```bash
cd fastapi-backend
./run.sh             # Start FastAPI server at http://localhost:8000

# Or manually:
cd fastapi-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Docker (Both Services):**
```bash
docker-compose up    # Start both services in containers
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
│   ├── profile/               # Profile editing page
│   ├── api/                   # API routes
│   │   ├── profile/           # Profile update endpoints
│   │   └── parse-resume/      # Proxy to FastAPI backend ✨ NEW
│   ├── layout.tsx             # Root layout with font configuration
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global Tailwind styles
├── components/
│   ├── auth/                  # Authentication forms
│   ├── dashboard/             # Dashboard components
│   ├── onboarding/            # Onboarding wizard & steps
│   └── profile/               # Profile editing components
│       └── editors/           # Individual section editors
├── lib/
│   ├── auth/                  # Auth server actions
│   ├── supabase/              # Supabase client configs
│   └── types/                 # TypeScript type definitions
├── hooks/                     # React hooks (useAuth)
├── supabase/
│   └── migrations/            # Database schema migrations
├── public/                    # Static assets
├── fastapi-backend/           # Python FastAPI backend ✨ NEW
│   ├── main.py                # FastAPI app entry point
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Docker configuration
│   ├── app/
│   │   ├── models/
│   │   │   └── schemas.py     # Pydantic response models
│   │   └── services/
│   │       ├── document_parser.py   # PDF/DOCX/TXT parsing
│   │       └── ai_structurer.py     # Claude AI integration
│   └── .env.example           # Environment variables template
├── dev.sh                     # Start both services ✨ NEW
└── docker-compose.yml         # Docker orchestration ✨ NEW
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

**Implemented (Next.js):**
```
✅ /api/profile/personal      # Update personal information
✅ /api/profile/experience    # Update work experience
✅ /api/profile/education     # Update education
✅ /api/profile/skills        # Update skills
✅ /api/parse-resume          # Proxy to FastAPI for document parsing ✨ NEW
```

**Implemented (FastAPI Backend):**
```
✅ POST /api/parse-resume     # Parse uploaded resume (PDF/DOCX/TXT) ✨ NEW
✅ GET  /health               # Backend health check ✨ NEW
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

✅ **Phase 1.5 - Profile Editing** (Complete)
- `/profile` page with tabbed interface
- Edit personal information
- Manage work experience (add/edit/delete)
- Manage education (add/edit/delete)
- Manage skills (tag-based UI)
- API endpoints for profile updates

✅ **Phase 1.75 - Document Parsing Backend** (Complete) ✨ NEW
- FastAPI backend for resume document parsing
- Support for PDF, DOCX, and TXT file formats
- Claude AI integration for structuring parsed content
- Next.js API proxy route (`/api/parse-resume`)
- Development scripts and Docker configuration

**Next Phases:**
- Phase 2: Resume Upload UI (file upload component + display structured data)
- Phase 3: AI Integration (Claude API for job description parsing)
- Phase 4: Resume Generation (AI-tailored content)
- Phase 5: Resume Editor (live preview, templates)
- Phase 6: PDF Export
- Phase 7: Stripe Payments

## Configuration Files

- `tsconfig.json` - TypeScript strict mode, JSX transform: react-jsx
- `next.config.ts` - Next.js configuration (currently default)
- `eslint.config.mjs` - ESLint with Next.js rules
- `postcss.config.mjs` - PostCSS with Tailwind v4

## Environment Variables

### Next.js (`.env.local`)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# FastAPI Backend URL
FASTAPI_URL=http://localhost:8000  # Development
# FASTAPI_URL=https://your-fastapi-deployment.com  # Production

# Stripe (Future)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### FastAPI Backend (`fastapi-backend/.env`)
```bash
# Server
PORT=8000
NEXTJS_URL=http://localhost:3000

# Anthropic AI
ANTHROPIC_API_KEY=your_anthropic_api_key

# Logging
LOG_LEVEL=INFO
```

**Setup:** Copy `.env.example` files and fill in your values:
```bash
cp .env.example .env.local
cp fastapi-backend/.env.example fastapi-backend/.env
```
