# Resume Generator MVP - Feature Specification

## Project Overview
AI-powered resume generator that tailors resumes based on job descriptions using Claude API. Freemium model with 5 free resume generations, then paid Pro tier.

---

## 1. Authentication & User Management

### 1.1 Sign Up / Sign In
- Email & password authentication (Supabase Auth)
- Google OAuth sign-in
- Email verification required
- Password reset functionality

### 1.2 User Profiles
- Basic profile information stored in Supabase
- Track resume generation count (for free tier limit)
- Subscription status (Free / Pro)

### 1.3 Free Tier Limitations
- **5 free resume generations per account**
- Counter resets only with Pro upgrade (not monthly)
- Clear UI indication of remaining generations
- Prompt to upgrade when limit reached

---

## 2. Onboarding Flow

### 2.1 Initial Information Capture
After sign up, users provide base information through a multi-step form:

**Step 1: Personal Information**
- Full name
- Email
- Phone number
- Location (City, State/Country)
- LinkedIn URL (optional)
- Portfolio/Website URL (optional)
- Professional title/headline

**Step 2: Work Experience**
For each position:
- Company name
- Job title
- Employment dates (start/end, with "current" option)
- Location
- Responsibilities/achievements (bullet points - freeform text area)

**Step 3: Education**
For each degree:
- Institution name
- Degree type & field of study
- Graduation date (or expected)
- GPA (optional)
- Relevant coursework/honors (optional)

**Step 4: Skills**
- Technical skills (comma-separated or tag input)
- Soft skills (comma-separated or tag input)
- Languages (with proficiency level)
- Certifications (name, issuing org, date)

**Step 5: Additional Sections (Optional)**
- Projects (title, description, link, technologies)
- Volunteer experience
- Awards & achievements
- Publications

### 2.2 Data Storage
- All base information stored in Supabase PostgreSQL
- JSONB format for flexible sections
- Editable at any time from profile/dashboard

---

## 3. Core Resume Generation Flow

### 3.1 Job Description Input
**Simple text input interface:**
- Large text area for pasting job description
- Character count indicator
- Save job descriptions for future reference
- Recent job descriptions list (last 10)

### 3.2 AI Configuration per Section
**Database-driven AI behavior configuration:**

Each resume section has configurable AI generation rules stored in database:

```
ai_section_config table:
- section_name (e.g., "work_experience", "skills", "summary")
- ai_enabled (boolean)
- ai_prompt_template (text)
- processing_priority (integer)
- user_editable (boolean)
```

**MVP Sections with AI:**
1. **Professional Summary** - AI generates 2-3 sentence summary based on job description
2. **Work Experience** - AI rewrites bullet points to match job keywords
3. **Skills** - AI reorders and highlights relevant skills
4. **Projects** (if applicable) - AI emphasizes relevant project aspects

### 3.3 AI Generation Process
1. User pastes job description
2. System parses job description using Claude API to extract:
   - Key required skills
   - Important keywords
   - Job level/seniority
   - Industry/domain
3. For each configured section:
   - AI analyzes user's base content
   - Generates tailored version matching job description
   - Preserves truthfulness (no fabrication)
4. User reviews AI-generated content
5. User can edit any section before finalizing

### 3.4 Resume Editor
**Side-by-side view:**
- Left: Editable content (AI-generated + user base info)
- Right: Live preview of formatted resume
- Section-by-section editing
- Undo/redo functionality
- Save draft functionality

---

## 4. Resume Templates

### 4.1 Template Selection
**Multiple professional templates (minimum 3 for MVP):**

1. **Classic** - Traditional single-column layout
2. **Modern** - Clean two-column layout with accent color
3. **Minimal** - Ultra-clean, minimal design with plenty of whitespace

### 4.2 Template Features
- Template preview before selection
- Switch templates without losing content
- Consistent structure across all templates
- ATS-friendly formatting (no tables, no complex graphics)

### 4.3 Template Customization (MVP)
Basic customization options:
- Primary accent color picker
- Font choice (2-3 professional options: Roboto, Open Sans, Lato)
- Font size adjustment (Small, Medium, Large)

---

## 5. Export & Download

### 5.1 Free Tier Export
- **PDF only** in trial/free mode
- High-quality PDF generation
- Each export counts toward 5-generation limit
- Watermark: Small "Generated with [AppName]" footer (removable in Pro)

### 5.2 Pro Tier Export (Future Phase)
- PDF without watermark
- DOCX format
- Plain text format
- Unlimited generations

### 5.3 File Naming
- Auto-generated filename: `{FirstName}_{LastName}_Resume_{Date}.pdf`
- User can rename before download

---

## 6. Dashboard & Resume Management

### 6.1 Main Dashboard
After onboarding, users see:
- "Create New Resume" button (prominent)
- List of previously generated resumes
- Generation count indicator: "X/5 resumes remaining" or "Pro: Unlimited"
- Quick access to edit base profile

### 6.2 Resume Library
Each saved resume shows:
- Job title/company it was tailored for
- Date created
- Thumbnail preview
- Actions: View, Edit, Download, Delete
- Duplicate resume (to create variation)

### 6.3 Base Profile Management
- Edit any section of base information
- Changes reflect in future resume generations
- Option to regenerate existing resumes with updated info

---

## 7. Subscription & Payments

### 7.1 Free Tier
- 5 resume generations total
- PDF export only with watermark
- All templates available
- All AI features available
- Email support

### 7.2 Pro Tier - $X/month or $Y/year
**Pro features:**
- Unlimited resume generations
- No watermark
- DOCX export (future)
- Plain text export (future)
- Priority support
- Early access to new features

### 7.3 Payment Integration
- Stripe integration for payments
- Monthly and annual billing options
- Clear upgrade prompts when free limit reached
- Subscription management (cancel, update payment)

### 7.4 Upgrade Flow
- Modal appears when user hits 5th generation or tries 6th
- Clear feature comparison table
- One-click upgrade to Pro
- Immediate access after payment

---

## 8. Technical Implementation Notes

### 8.1 Tech Stack
- **Frontend:** Next.js 16+ (React, TypeScript)
- **Backend:** Next.js API routes + FastAPI (Python) for document parsing
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **AI:** Claude API (Anthropic) - used in both Next.js and FastAPI
- **Document Parsing:** PyPDF (PDF), python-docx (DOCX), TXT support
- **Payments:** Stripe
- **Hosting:** Vercel (Next.js) + FastAPI deployment (Railway/Render/etc)
- **PDF Generation:** `@react-pdf/renderer` or `puppeteer`

### 8.2 Database Schema (High Level)

```sql
-- Managed by Supabase Auth
auth.users

-- Custom tables
users_profile (
  id (FK to auth.users)
  generation_count (integer, default 0)
  subscription_tier (enum: free, pro)
  subscription_id (stripe customer ID)
  onboarding_completed (boolean)
)

base_information (
  id
  user_id (FK)
  personal_info (JSONB)
  work_experience (JSONB array)
  education (JSONB array)
  skills (JSONB)
  additional_sections (JSONB)
)

job_descriptions (
  id
  user_id (FK)
  company_name
  job_title
  description_text
  parsed_keywords (JSONB)
  created_at
)

resumes (
  id
  user_id (FK)
  job_description_id (FK, nullable)
  title (for user reference)
  template_id
  content (JSONB - final resume content)
  created_at
  updated_at
)

ai_section_config (
  id
  section_name
  ai_enabled
  ai_prompt_template
  processing_priority
)

subscription_history (
  id
  user_id
  stripe_subscription_id
  status
  start_date
  end_date
)
```

### 8.3 AI Prompt Strategy
Store prompt templates in database for easy iteration without code changes:

**Example - Work Experience Section:**
```
Analyze this job description: {job_description}

User's original work experience entry:
- Company: {company}
- Role: {role}
- Bullets: {original_bullets}

Rewrite the bullet points to:
1. Emphasize skills/experience matching the job description
2. Use similar keywords and language from the job posting
3. Keep all information truthful (don't add fake achievements)
4. Use strong action verbs
5. Quantify results where the original content provides numbers

Return 3-5 optimized bullet points.
```

### 8.4 Key API Endpoints

**Next.js API Routes:**
```
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/google

POST /api/onboarding/complete
GET  /api/profile
PUT  /api/profile

✅ POST /api/parse-resume           (proxy to FastAPI - IMPLEMENTED)

POST /api/job-description/parse
GET  /api/job-descriptions/recent

POST /api/resume/generate
GET  /api/resume/:id
PUT  /api/resume/:id
DELETE /api/resume/:id
GET  /api/resumes (list all for user)

POST /api/resume/:id/export (PDF generation)

POST /api/subscription/create-checkout
POST /api/subscription/manage
POST /api/webhook/stripe (for subscription updates)
```

**FastAPI Backend Endpoints:**
```
✅ POST /api/parse-resume          (parse PDF/DOCX/TXT resumes - IMPLEMENTED)
✅ GET  /health                     (health check - IMPLEMENTED)
```

---

## 9. MVP Success Criteria

### 9.1 Core Functionality
- [ ] User can sign up with email or Google
- [ ] User completes onboarding flow with base information
- [ ] User can paste job description
- [ ] AI successfully generates tailored resume content
- [ ] User can select from 3+ templates
- [ ] User can edit generated content
- [ ] User can export to PDF
- [ ] Free tier limit (5 generations) enforced
- [ ] Pro subscription flow works end-to-end

### 9.2 Quality Metrics
- Resume generation completes in < 30 seconds
- AI-generated content is relevant and accurate
- PDF export is professional and ATS-friendly
- No data loss during editing sessions
- Mobile-responsive (at minimum for viewing)

### 9.3 User Experience
- Onboarding completion rate > 70%
- Clear upgrade prompts for free users
- Smooth payment/upgrade flow
- Resume looks professional in PDF format

---

## 10. Future Enhancements (Post-MVP)

### Phase 2
- ✅ **Resume import/parsing (upload existing resume)** - Complete (backend + frontend)
- DOCX export
- Cover letter generation
- LinkedIn import
- More templates (10+ total)
- ATS compatibility score
- Keyword match percentage

### Phase 3
- Chrome extension (generate from job posting page)
- Resume version comparison
- A/B test different versions
- Share resume publicly (unique URL)
- Team/workspace features for career coaches
- White-label option

### Phase 4
- Interview prep based on resume + job description
- Job application tracking
- Application status dashboard
- Networking suggestions
- Salary negotiation insights

---

## 11. Open Questions & Decisions Needed

### Pricing
- **Monthly price:** $9.99? $14.99? $19.99?
- **Annual discount:** 20% off? 30% off?
- **Free tier:** 5 generations total or 5/month?
  - *Current decision: 5 total (more aggressive conversion)*

### Branding
- App name?
- Domain name?
- Logo/color scheme?

### AI Behavior
- How aggressive should AI rewriting be?
- Should users see "before/after" comparison?
- Option to adjust AI tone (formal, casual, technical)?

### Launch Strategy
- Beta phase with limited users?
- Lifetime deal for early adopters?
- Referral program (give 2 extra generations for referral)?

---

## 12. Development Phases

### ✅ Phase 1: Foundation (COMPLETED)
- ✅ Set up Next.js + Supabase + Vercel
- ✅ Implement auth (email + Google)
- ✅ Database schema creation
- ✅ Basic UI framework
- ✅ 5-step onboarding form
- ✅ User dashboard with tier management
- ✅ Landing page

### ✅ Phase 1.5: Profile Management (COMPLETED)
- ✅ Profile editing page with tabbed interface
- ✅ Edit personal information
- ✅ Manage work experience (CRUD)
- ✅ Manage education (CRUD)
- ✅ Manage skills (tag-based UI)
- ✅ API endpoints for profile updates

### ✅ Phase 1.75: Document Parsing Backend (COMPLETED)
- ✅ FastAPI backend service
- ✅ PDF, DOCX, TXT parsing
- ✅ Claude AI integration for structuring
- ✅ Next.js API proxy routes
- ✅ Development and Docker scripts

### ✅ Phase 2: Resume Upload UI (COMPLETED)
- ✅ Drag-and-drop file upload component
- ✅ AI parsing with loading states
- ✅ Structured data display component
- ✅ Save imported data to Supabase
- ✅ Dashboard integration
- ✅ Error handling and user feedback

### Phase 3: AI Integration
- Claude API integration
- Job description parsing
- Resume content generation
- AI configuration system

### Phase 4: Resume Editor
- Content editor interface
- Live preview
- Template system (3 templates)

### Phase 5: Export & Limits
- PDF generation
- Generation counter
- Free tier enforcement

### Phase 6: Payments
- Stripe integration
- Subscription management
- Upgrade flow

### Phase 7: Polish & Testing
- Bug fixes
- Performance optimization
- User testing
- Documentation

### Phase 8: Launch
- Deploy to production
- Marketing site/landing page
- Launch!

---

## 13. Risk Mitigation

### Technical Risks
- **AI costs too high:** Implement caching, optimize prompts, set token limits
- **PDF generation slow:** Pre-render templates, use worker threads
- **Database performance:** Proper indexing, connection pooling

### Business Risks
- **Low conversion to Pro:** A/B test pricing, improve value proposition
- **Users game the free tier:** Email verification required, fraud detection
- **Competition:** Focus on quality AI output and UX

### Legal/Compliance
- Privacy policy (GDPR compliant)
- Terms of service
- Data retention policies
- Payment processing compliance (handled by Stripe)

---

## Notes
- This MVP focuses on core value: AI-powered resume tailoring
- Keep UI simple and intuitive
- Prioritize AI quality over feature quantity
- Fast iteration based on user feedback post-launch

