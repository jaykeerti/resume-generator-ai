# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered resume generator that tailors resumes based on job descriptions using OpenAI GPT-4o mini. Features a freemium model with 5 free PDF exports, then a paid Pro tier with unlimited exports. Full specification at `README.md`.

**Key Value Proposition:** Automatically tailors user's resume content to match specific job descriptions while preserving truthfulness - only enhancing and reframing existing content, never fabricating.

**Monorepo Structure:** This repository contains two separate applications:
1. **Next.js Frontend** (`resume-generator-ai/`) - Main web application
2. **FastAPI Backend** (`fastapi-backend/`) - Document parsing microservice

Both services run independently and communicate via HTTP. The Next.js app proxies document parsing requests to FastAPI.

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

### Quick Start (Both Services - Recommended)
```bash
./dev.sh             # Start both Next.js (port 3000) and FastAPI (port 8000)
```

**What `dev.sh` does:**
1. Creates Python virtual environment if it doesn't exist (`fastapi-backend/venv/`)
2. Installs/updates Python dependencies from `requirements.txt`
3. Checks for `.env` files in both projects, creates from `.env.example` if missing
4. Starts FastAPI in background → logs to `logs/fastapi.log`
5. Waits 3 seconds for FastAPI to initialize
6. Installs npm dependencies if `node_modules/` doesn't exist
7. Starts Next.js in background → logs to `logs/nextjs.log`
8. Displays status and log file locations
9. Handles graceful shutdown: Press `Ctrl+C` to kill both processes

**Important Notes:**
- Must run from repository root (where `dev.sh` is located)
- Logs stored in `logs/` directory (create this directory if it doesn't exist)
- Script uses bash syntax (may need adjustment for Windows/PowerShell)
- On Windows, use Git Bash or WSL to run the script

### Individual Services

**Next.js Frontend:**
```bash
cd resume-generator-ai
npm install               # First time only
npm run dev               # Start dev server at http://localhost:3000
npm run build             # Build production bundle
npm run start             # Start production server
npm run lint              # Run ESLint
npm run supabase:start    # Start local Supabase (Docker required)
npm run supabase:stop     # Stop local Supabase
npm run supabase:status   # Check Supabase status
npm run supabase:reset    # Reset local database (applies migrations)
npm run seed:user         # Create test user for local development
```

**FastAPI Backend:**
```bash
cd fastapi-backend
./run.sh             # Automated setup (creates venv, installs deps, starts server)

# Or manually:
cd fastapi-backend
python3 -m venv venv
source venv/bin/activate          # Linux/Mac
# venv\Scripts\activate           # Windows
pip install -r requirements.txt
python main.py                     # Runs on port 8000
```

**Docker (Both Services):**
```bash
docker-compose up    # Start both services in containers
docker-compose down  # Stop and remove containers
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
- `@/*` maps to `resume-generator-ai/` project root (configured in `tsconfig.json`)
  - Example: `@/lib/supabase/server` → `resume-generator-ai/lib/supabase/server.ts`

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

**Implemented (Next.js - AI Features):**
```
✅ /api/resume/generate           # Parse job description + tailor resume with OpenAI
```

**To be implemented:**
```
/api/auth/*                      # Authentication endpoints (Supabase handles most)
/api/subscription/*              # Stripe integration
/api/webhook/stripe              # Stripe webhooks
```

### AI Integration Strategy

**Current Implementation (Phase 3 Complete):**
Resume generation flow in `/api/resume/generate`:
1. **Parse Job Description** (`lib/services/jobDescriptionParser.ts`):
   - Accepts raw text or URL
   - OpenAI extracts: job title, company, location, skills, qualifications, keywords
   - Saved to `job_descriptions` table with parsed metadata
2. **Retrieve User Profile** (`base_information` table):
   - Gets personal info, work experience, education, skills
   - Creates empty profile if doesn't exist
3. **AI Tailoring** (`lib/services/resumeTailoring.ts`):
   - Two modes: conservative (subtle) or moderate (aggressive)
   - Tailors: professional summary, work experience bullets, skills ordering, projects
   - Preserves education and personal info (not tailored)
   - Uses markdown bold (`**text**`) for metrics
4. **Create Resume Record**:
   - Stores tailored content in `resumes` table
   - Keeps original content in `customization.original_content` for revert capability
   - Sets professional title from job description

**Key Design Decisions:**
- AI prompts are hardcoded in `resumeTailoring.ts` (not in database yet)
  - Future: Move to `ai_section_config` table for A/B testing
- AI processes sections independently for modularity
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

### TipTap Formatting Preservation (HTML to Markdown Strategy) ✨ NEW
**Balances user formatting control with clean data storage:**

The system preserves user-applied formatting from the TipTap rich text editor while maintaining clean, portable text storage:

**Implementation Details:**
1. **Storage Format**: Plain text with markdown syntax (`**bold**`, `*italic*`)
2. **Conversion on Save** (`ExperienceEditor.tsx:189-223`):
   ```typescript
   // Convert HTML tags to markdown
   content = content.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
   content = content.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
   // Strip remaining HTML tags
   ```
3. **Preview Rendering** (`textFormatting.tsx:76-95`): Automatically detects and renders markdown
4. **AI Compatibility**: AI generates markdown natively, manual edits convert to markdown - consistent format throughout

**Why This Approach:**
- ✅ Preserves bold/italic formatting from toolbar
- ✅ Clean text storage (no HTML pollution, no XSS risk)
- ✅ Consistent with AI-generated markdown
- ✅ Portable and searchable in database
- ✅ No additional dependencies
- ❌ Trade-off: Underline and text alignment not preserved (acceptable for resume use case)

**Alternative Considered:** Full HTML storage (Reactive Resume approach) was rejected because:
- Requires HTML sanitization (security overhead)
- Conflicts with AI markdown workflow
- More complex data handling
- Not necessary for AI-first resume generator

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

**Recent UX & Formatting Improvements (Latest Session):**
- ✅ **TipTap Formatting Preservation** - HTML formatting (bold/italic) now converts to markdown when saving, preserving user formatting in preview (`ExperienceEditor.tsx:189-223`)
- ✅ **Professional Summary Bullets Removed** - Disabled bullet list options in summary editor for cleaner continuous text format (`SummaryEditor.tsx:23`)
- ✅ **Skills Text Justification** - Applied justified text alignment across all three templates for better visual balance (`ClassicTemplate.tsx`, `ModernTemplate.tsx`, `MinimalTemplate.tsx`)
- ✅ **TipTap Selection Retention** - Fixed cursor position loss when content updates externally, preserving user selection state (`RichTextEditor.tsx:89-105`)
- ✅ **Enhanced Arrow Button Visibility** - Improved up/down arrows for experience reordering with better padding, borders, and font weight (`ExperienceEditor.tsx:115,124`)
- ✅ **HTML Tag Prevention** - Fixed literal HTML tags appearing in preview by using `textContent` instead of `innerHTML` when converting back to array
- ✅ **AI Header Prevention** - Added CRITICAL instructions to AI prompts preventing "Professional Summary" headers from being prepended to generated text (`resumeTailoring.ts:198-255`)
- ✅ **Dashboard Resume Cards Enhancement** - Added "Company:" and "Title:" labels to resume cards in dashboard for better clarity (`DashboardContent.tsx:276-287`)

✅ **Phase 3 & 4 - AI Integration** (Complete)
- Job description parsing with OpenAI
- AI resume tailoring (conservative and moderate modes)
- Professional summary generation
- Work experience bullet optimization
- Skills reordering and highlighting
- Project description enhancement
- Integration with resume generation flow

**Next Phases:**
- Phase 7: Stripe Payments & Subscription Management
- Phase 8: Analytics & Performance Monitoring

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

### Local Development with Supabase

**Option 1: Local Supabase (Recommended for Development)**
```bash
cd resume-generator-ai
npm run supabase:start    # Requires Docker
npm run supabase:status   # Get local credentials
npm run seed:user         # Create test user
```

Update `.env.local` with local Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase:status>
SUPABASE_SERVICE_ROLE_KEY=<from supabase:status>
```

**Option 2: Cloud Supabase (Production-like)**
Use your cloud Supabase project credentials directly in `.env.local`

**Database Migrations:**
- Migrations in `resume-generator-ai/supabase/migrations/`
- Applied automatically on `supabase:start` or `supabase:reset`
- For cloud: Apply via Supabase dashboard SQL editor

## Known Issues & Future Improvements

### Current Limitations
- **TipTap Formatting**: Underline and per-paragraph text alignment not preserved when saving (converts to plain markdown)
- **AI Prompt Iteration**: AI prompts are hardcoded in `resumeTailoring.ts` - consider moving to database (`ai_section_config` table) for easier A/B testing
- **Template Customization**: Limited to color, font, and size - could expand to spacing, margins, section ordering

### Recommended Next Steps
1. **Phase 3 - Job Description Parsing**: Implement `/api/job-description/parse` endpoint with Claude API
2. **Phase 4 - AI Resume Generation**: Complete `/api/resume/generate` with section-by-section AI tailoring
3. **Phase 7 - Stripe Integration**: Implement subscription management and upgrade flows
4. **Performance Monitoring**: Add Sentry or similar for error tracking in production
5. **Analytics**: Track resume generation success rates, template preferences, user drop-off points

### Recent Bug Fixes (Reference)
- ✅ Fixed `trim()` errors on non-string values with comprehensive type guards
- ✅ Fixed AI prepending "Professional Summary" headers to generated text
- ✅ Fixed HTML tags appearing literally in experience preview
- ✅ Fixed TipTap cursor position loss when content updates externally
- ✅ Fixed professional summary character limit truncation (increased to 800)
- ✅ Added justify alignment to Professional Summary in all templates (commit d3fd955)
- ✅ Added Company/Title labels to dashboard resume cards using label:value format (commit 8a9b8d0)
- ✅ Preserved TipTap formatting by converting HTML to markdown (commit 3f0a70b)

### Testing Recommendations
- Test resume generation with various job descriptions (technical, non-technical, executive)
- Test PDF generation across all three templates with different content lengths
- Test mobile responsiveness of resume editor on various devices
- Test edge cases: empty sections, very long text, special characters, non-English text
- Load test: Multiple concurrent PDF generations (serverless Chromium limitations)

## Important Implementation Notes

### PDF Generation with Puppeteer
- Uses `@sparticuz/chromium` for serverless deployment (Vercel compatible)
- Downloads Chromium binary from GitHub releases on first use
- Location: `lib/pdf/generator.ts`
- All templates currently render with the same HTML generator (visual differentiation exists only in web preview)
- Watermark added for free tier: "Generated with Resume AI - Upgrade to remove watermark"
- Each export increments `users_profile.generation_count`

### Database JSONB Structure
Most content stored as JSONB for flexibility:
- `base_information.personal_info` - Personal details object
- `base_information.work_experience` - Array of work history
- `base_information.education` - Array of education entries
- `base_information.skills` - Object with technical, soft, languages, certifications arrays
- `resumes.content` - Complete resume content snapshot
- `resumes.customization` - Template styling preferences

This allows dynamic sections without schema migrations but requires careful JSONB querying.

### Template System Architecture
**Three-layer rendering:**
1. **Editor Components** (`components/resume/ResumeEditor.tsx`) - Editable forms
2. **Preview Components** (`components/templates/*.tsx`) - Real-time React rendering
3. **PDF Generator** (`lib/pdf/generator.ts`) - HTML string generation for Puppeteer

Note: Templates 1 and 2 need alignment - PDF generator uses same HTML for all templates currently.

### AI Service Integration
- **Job Description Parsing:** `lib/services/jobDescriptionParser.ts` extracts skills/keywords
- **Resume Tailoring:** `lib/services/resumeTailoring.ts` with conservative/moderate modes
- **Modes:**
  - Conservative: Subtle keyword insertion, minimal rewriting
  - Moderate: Aggressive rewriting with metric emphasis
- All AI calls use OpenAI GPT-4o mini (cost optimization: 20x cheaper than Claude)

### Authentication & Middleware

**Critical Performance Optimization:**
The app uses `getValidatedUserId()` instead of `auth.getUser()` for performance:
- `getValidatedUserId()` validates JWT locally (no network call)
- First checks `x-user-id` header set by middleware
- Falls back to `auth.getClaims()` for local validation
- Location: `lib/supabase/server.ts:49-72`
- Use this in API routes instead of `auth.getUser()` for 2-3x faster authentication

**Middleware Configuration:**
- `middleware.ts` intercepts all routes to update Supabase session
- Sets `x-user-id` header for downstream performance
- Matcher pattern excludes static files, images, API routes
- Protected routes check session via `createClient()`
- Onboarding gate: `users_profile.onboarding_completed` must be true

**DNS & Connection Optimization:**
- `lib/supabase/env.ts` detects local vs remote Supabase
- Remote connections use IPv4-first DNS and 20s timeout (via undici)
- Local connections skip optimizations (no need)
- Prevents timeout errors with cloud Supabase

### Free Tier Enforcement
Counter tracked in `users_profile.generation_count`:
- Incremented on successful PDF download (route: `/api/resume/[id]/export`)
- Dashboard shows "X/5 resumes remaining"
- Export button disabled when limit reached
- Pro tier: unlimited exports, no watermark

## Critical Architecture Decisions

### Why Two Separate AI Services?
- **FastAPI Backend**: Document parsing (PDF/DOCX → text extraction + structure)
  - Uses OpenAI GPT-4o mini for structuring raw resume text
  - Runs as separate microservice (Python ecosystem better for PDF parsing)
- **Next.js API Routes**: Job description parsing + resume tailoring
  - Uses OpenAI GPT-4o mini for all AI operations
  - Integrated directly in Next.js for simpler deployment

### Database Design Philosophy
- **JSONB Storage**: Most content stored as JSONB for flexibility
  - Pros: No schema migrations for new fields, easy to iterate
  - Cons: Requires careful null checking, no type safety at DB level
  - All content must be validated in TypeScript before storage
- **Audit Trail**: `resumes.customization.original_content` stores untailored version
  - Enables "revert to original" functionality
  - Useful for A/B testing different tailoring strategies

### Template Architecture Trade-offs
**Current State:** Three-layer rendering with inconsistency
1. **React Preview Components** (`components/templates/*.tsx`) - Visual differentiation works
2. **PDF Generator** (`lib/pdf/generator.ts`) - Same HTML for all templates (needs work)

**Known Issue:** Template visual differences only show in web preview, not in PDF export
**Future Fix:** PDF generator needs template-specific HTML generation

### Performance Optimizations Applied
1. **Authentication**: Local JWT validation instead of network calls
2. **DNS**: IPv4-first for remote Supabase connections
3. **Auto-save**: 2-second debounce prevents excessive API calls
4. **OpenAI Model**: GPT-4o mini (20x cheaper than GPT-4, 20x cheaper than Claude)

## Common Development Patterns

### Creating New API Routes
```typescript
// app/api/your-endpoint/route.ts
import { createClient, getValidatedUserId } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Use getValidatedUserId() for performance (no network call)
  const userId = await getValidatedUserId()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

### JSONB Queries in Supabase
```typescript
// Query nested JSONB field
const { data } = await supabase
  .from('base_information')
  .select('personal_info->full_name')
  .eq('user_id', userId)
  .single()

// Update specific JSONB field
const { error } = await supabase
  .from('base_information')
  .update({
    'personal_info': {
      ...existingPersonalInfo,
      full_name: newName
    }
  })
  .eq('user_id', userId)
```

### Auto-save Pattern (Used in Resume Editor)
```typescript
const debouncedSave = useCallback(
  debounce(async (content) => {
    await fetch(`/api/resume/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
  }, 2000),
  [id]
)
```

## Troubleshooting Common Issues

### "Chromium failed to download" in PDF Generation
- Check Vercel function timeout (increase to 60s for Puppeteer)
- Verify `@sparticuz/chromium` version compatibility
- Check logs: PDF generator includes detailed console.log statements
- Local testing: Puppeteer downloads to node_modules cache

### "Cannot read property 'trim' of undefined"
- Add type guards before calling string methods
- Example: `if (typeof value === 'string' && value.trim())`
- Common in JSONB data where types aren't enforced

### TipTap Editor Issues
- **Cursor position loss:** Use transaction approach with selection preservation
- **Formatting not saving:** Ensure HTML→markdown conversion in save handler
- **Extensions not loading:** Check extension imports and order

### Database Migration Issues
- Migrations located in `resume-generator-ai/supabase/migrations/`
- Apply via Supabase dashboard SQL editor or CLI
- RLS policies required for all user-facing tables
- Test with non-admin user to verify RLS works

### FastAPI CORS Errors
- Verify `NEXTJS_URL` in FastAPI `.env` matches Next.js origin
- Check `allow_origins` in `fastapi-backend/main.py`
- Development: `http://localhost:3000`
- Production: Your Vercel deployment URL
