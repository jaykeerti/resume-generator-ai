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
  - AI: OpenAI API (GPT-4o mini) - used for resume parsing and job tailoring ✅ Migrated
  - Document Parsing: PyPDF (PDF), python-docx (DOCX)
  - PDF Generation: Puppeteer + @sparticuz/chromium (serverless) ✅ Implemented
  - Payments: Stripe (planned)
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

### Deployment

**Next.js Frontend (Vercel):**

**IMPORTANT:** The Next.js project is in the `resume-generator-ai/` subdirectory. Vercel must be configured with the correct root directory.

```bash
# Deploy from the Next.js project directory
cd resume-generator-ai
vercel --prod --yes        # Deploy to production

# Common Vercel commands
vercel ls                  # List deployments
vercel logs                # View deployment logs
vercel env ls              # List environment variables
vercel env pull            # Pull env vars to local .env file
vercel inspect <URL>       # Inspect deployment details
```

**Vercel Project Configuration:**
- **Root Directory**: MUST be set to `resume-generator-ai` in Vercel dashboard
  - Go to: Settings → General → Root Directory → Set to `resume-generator-ai`
  - Without this, deployments will fail with "Couldn't find any pages or app directory" error
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

**Deployment Status:**
- Production URL: https://resume-generator-ai-sandy.vercel.app
- Auto-deploys from `main` branch to production
- Environment variables configured in Vercel dashboard
- `.vercel` directory is located in `resume-generator-ai/.vercel/`

**Vercel Environment Variables:**
```bash
# View all environment variables
cd resume-generator-ai && vercel env ls

# Add new environment variable
vercel env add VARIABLE_NAME production

# Remove environment variable
vercel env rm VARIABLE_NAME production
```

**FastAPI Backend Deployment:**

The FastAPI backend needs to be deployed separately. It returns dummy data when `OPENAI_API_KEY` is not configured, allowing frontend testing without AI setup.

**Option 1: Railway**
```bash
cd fastapi-backend
railway login
railway init
railway up

# Add environment variables in Railway dashboard:
# - OPENAI_API_KEY (optional - uses dummy data if not set)
# - PORT (Railway sets automatically)
```

**Option 2: Render**
```bash
# Connect your GitHub repo to Render
# Set build command: pip install -r requirements.txt
# Set start command: uvicorn main:app --host 0.0.0.0 --port $PORT
# Add environment variables:
# - OPENAI_API_KEY (optional - uses dummy data if not set)
```

**Option 3: DigitalOcean App Platform**
```bash
# Deploy via DigitalOcean dashboard
# Connect GitHub repo
# Configure Python app with uvicorn
# Add environment variables in dashboard
```

**After Deploying FastAPI Backend:**
1. Copy your FastAPI production URL (e.g., `https://your-app.railway.app`)
2. Update `FASTAPI_URL` in Vercel:
   ```bash
   cd resume-generator-ai
   vercel env add FASTAPI_URL production
   # Enter your FastAPI URL when prompted
   ```
3. Redeploy Next.js app: `vercel --prod`

**FastAPI Dummy Data Mode:**
- Backend returns sample resume data when `OPENAI_API_KEY` is not set
- This allows full frontend testing without AI API costs
- To enable real AI parsing, add `OPENAI_API_KEY` to your backend deployment

### Deployment Troubleshooting

**Error: "Couldn't find any pages or app directory"**
- **Cause**: Vercel is looking in the wrong directory (root instead of `resume-generator-ai/`)
- **Fix**:
  1. Go to Vercel Dashboard → Settings → General
  2. Set **Root Directory** to `resume-generator-ai`
  3. Save and redeploy

**Error: "FastAPI backend is not responding" (502)**
- **Cause**: `FASTAPI_URL` not configured or FastAPI backend not deployed
- **Fix**:
  1. Deploy FastAPI backend first (Railway/Render/DigitalOcean)
  2. Add `FASTAPI_URL` environment variable in Vercel with your backend URL
  3. Redeploy Next.js app

**Error: "Your project's URL and Key are required to create a Supabase client"**
- **Cause**: Supabase environment variables not set
- **Fix**: Add these to Vercel environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY` (for Phase 3 - AI job tailoring)

**Vercel Auto-Deploy Not Working**
- Check that GitHub integration is connected
- Verify production branch is set to `main`
- Check deployment logs for errors: `vercel logs --prod`

**Build Succeeds But Site Shows 500 Error**
- Check runtime logs: `vercel logs <deployment-url>`
- Verify all environment variables are set correctly
- Test locally first: `cd resume-generator-ai && npm run build && npm start`

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)

## Project Structure

```
resume-generator-ai/
├── app/                       # Next.js App Router pages & layouts
│   ├── auth/                  # Authentication pages (signin, signup, callback)
│   ├── dashboard/             # User dashboard
│   │   └── loading.tsx        # Dashboard loading skeleton ✨ NEW
│   ├── import/                # Resume import page
│   ├── onboarding/            # 5-step onboarding wizard
│   ├── profile/               # Profile editing page
│   ├── resume/                # Resume-related pages ✨ NEW
│   │   ├── new/               # Create new resume
│   │   └── editor/[id]/       # Edit resume with live preview
│   ├── api/                   # API routes
│   │   ├── profile/           # Profile update endpoints
│   │   ├── parse-resume/      # Proxy to FastAPI backend
│   │   └── resume/            # Resume CRUD endpoints ✨ NEW
│   │       ├── create/        # Create new resume
│   │       └── [id]/          # Get/update/delete resume
│   │           └── export/    # PDF export endpoint
│   ├── layout.tsx             # Root layout with font configuration
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global Tailwind styles with input fixes
├── components/
│   ├── auth/                  # Authentication forms
│   ├── dashboard/             # Dashboard components
│   ├── import/                # Resume import components
│   ├── onboarding/            # Onboarding wizard & steps
│   ├── profile/               # Profile editing components
│   │   └── editors/           # Individual section editors
│   ├── resume/                # Resume editor components ✨ NEW
│   │   ├── ResumeEditor.tsx   # Main editor with auto-save
│   │   └── editors/           # Section editors (6 total)
│   ├── templates/             # Resume templates ✨ NEW
│   │   ├── base/              # Base template components
│   │   ├── ClassicTemplate.tsx
│   │   ├── ModernTemplate.tsx
│   │   ├── MinimalTemplate.tsx
│   │   ├── TemplateRenderer.tsx
│   │   └── TemplateSelector.tsx
│   └── ui/                    # UI components ✨ NEW
│       └── UserProfileDropdown.tsx  # Circular avatar dropdown
├── lib/
│   ├── auth/                  # Auth server actions
│   ├── pdf/                   # PDF generation ✨ NEW
│   │   └── generator.ts       # Puppeteer PDF generation
│   ├── supabase/              # Supabase client configs
│   ├── templates/             # Template configurations
│   ├── types/                 # TypeScript type definitions
│   │   └── resume.ts          # Resume types (extended)
│   └── utils/                 # Utility functions ✨ NEW
│       └── textFormatting.ts  # Bold markdown conversion
├── hooks/                     # React hooks (useAuth)
├── supabase/
│   └── migrations/            # Database schema migrations
├── public/                    # Static assets
├── fastapi-backend/           # Python FastAPI backend
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
├── docs/
│   └── CLAUDE.md              # This file
├── dev.sh                     # Start both services
├── docker-compose.yml         # Docker orchestration
├── PHASE5_IMPLEMENTATION_PLAN.md  # Phase 5 documentation ✨ NEW
└── Readme.md                  # Project specification
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
✅ /api/profile/personal          # Update personal information
✅ /api/profile/experience        # Update work experience
✅ /api/profile/education         # Update education
✅ /api/profile/skills            # Update skills
✅ /api/parse-resume              # Proxy to FastAPI for document parsing
✅ /api/resume/create             # Create new resume from user profile ✨ NEW
✅ /api/resume/[id]               # GET/PUT/DELETE resume operations ✨ NEW
✅ /api/resume/[id]/export        # POST - PDF generation with Puppeteer ✨ NEW
```

**Implemented (FastAPI Backend):**
```
✅ POST /api/parse-resume         # Parse uploaded resume (PDF/DOCX/TXT)
✅ GET  /health                   # Backend health check
```

**To be implemented:**
```
/api/auth/*                      # Authentication endpoints (Supabase handles most)
/api/job-description/parse       # Parse job posting with Claude
/api/resume/generate             # Generate AI-tailored resume
/api/subscription/*              # Stripe integration
/api/webhook/stripe              # Stripe webhooks
```

### AI Integration Strategy
- Store AI prompt templates in database (`ai_section_config` table) for easy iteration
- AI processes sections independently: professional summary, work experience bullets, skills reordering, project descriptions
- Preserve truthfulness - AI enhances/rewords existing content, never fabricates
- Target: Resume generation completes in <30 seconds

### AI Bold Formatting Feature ✨ NEW
**Automatically bolds quantifiable metrics in AI-generated resumes:**

The AI is configured to wrap all quantifiable metrics with markdown bold syntax (`**text**`) for visual emphasis:
- Numbers: "Led a team of **5 engineers**"
- Percentages: "Reduced API response time by **40%**"
- Dollar amounts: "Generated **$2M** in revenue"
- Time periods: "Decreased deployment time by **60%**"
- User counts: "Serving **10,000+** daily active users"

**Implementation:**
1. **AI Prompt** (`fastapi-backend/app/services/ai_structurer.py:160-165`): Instructs Claude to wrap metrics in `**double asterisks**`
2. **PDF Generator** (`resume-generator-ai/lib/pdf/generator.ts:377-384`): Converts markdown bold to HTML `<strong>` tags
3. **Template Components**: All three templates use `formatTextWithBold()` utility for rendering
4. **Utility Function** (`resume-generator-ai/lib/utils/textFormatting.ts`): React helper for converting markdown to JSX

**Where it applies:**
- Professional summary sections
- Work experience responsibilities/achievements
- Automatically applies to all AI-parsed and AI-generated content

This enhances resume readability and helps quantifiable achievements stand out to recruiters.

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

✅ **Phase 1.75 - Document Parsing Backend** (Complete)
- FastAPI backend for resume document parsing
- Support for PDF, DOCX, and TXT file formats
- Claude AI integration for structuring parsed content
- Next.js API proxy route (`/api/parse-resume`)
- Development scripts and Docker configuration

✅ **Phase 2 - Resume Upload UI** (Complete)
- Drag-and-drop file upload component
- AI-powered resume parsing interface
- Parsed data display with structured sections
- Save imported data to Supabase profile
- Dashboard integration with import button
- Full error handling and loading states

✅ **Phase 5 - Resume Editor & Templates** (Complete) ✨ NEW
- Complete resume editor with live preview
- 3 professional templates (Classic, Modern, Minimal)
- Template customization (colors, fonts, sizes)
- Section-by-section editing (Personal Info, Summary, Experience, Education, Skills, Additional)
- Auto-save functionality (2-second debounce)
- 3-column desktop layout (Editing | Preview | Styling)
- Mobile responsive with swipeable tabs (Edit/Preview)
- Styling controls in bottom sheet modal (mobile)
- Real-time preview updates

✅ **Phase 6 - PDF Export** (Complete) ✨ NEW
- Server-side PDF generation with Puppeteer + Chromium
- Downloads from GitHub releases (serverless compatible)
- Free tier: 5 PDF exports with watermark
- Pro tier: Unlimited exports without watermark
- Generation count tracking and enforcement
- Success toast notifications
- Smooth UX (no page refresh, local state updates)
- Detailed error logging for debugging

**Additional Features Completed:**
- ✅ User profile dropdown with circular avatar
- ✅ Delete resume functionality
- ✅ Input text visibility improvements (better contrast)
- ✅ Performance optimizations (sign-in speed, parallel queries)
- ✅ Mobile swipeable tabs for resume editor

**Next Phases:**
- Phase 3: AI Integration (Claude API for job description parsing)
- Phase 4: Resume Generation (AI-tailored content)
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

# OpenAI (for Phase 3 - job description parsing & resume tailoring)
OPENAI_API_KEY=your_openai_api_key

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

# OpenAI (GPT-4o mini for resume parsing)
OPENAI_API_KEY=your_openai_api_key

# Logging
LOG_LEVEL=INFO
```

**Setup:** Copy `.env.example` files and fill in your values:
```bash
cp .env.example .env.local
cp fastapi-backend/.env.example fastapi-backend/.env
```
