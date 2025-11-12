# Changelog

All notable changes to the Resume Generator AI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2025-01-XX

#### Bold Formatting for Quantifiable Metrics
- **AI-powered bold formatting**: Quantifiable metrics (numbers, percentages, dollar amounts) in resumes are now automatically bolded for visual emphasis
- **Enhanced AI prompt** (`fastapi-backend/app/services/ai_structurer.py`): Claude AI now wraps all metrics with markdown bold syntax (`**text**`)
- **Text formatting utility** (`resume-generator-ai/lib/utils/textFormatting.ts`): New utility function to convert markdown bold to React elements
- **PDF generator support** (`resume-generator-ai/lib/pdf/generator.ts`): Converts markdown bold to HTML `<strong>` tags in PDF exports
- **Template updates**: All three resume templates (Classic, Modern, Minimal) now render bold metrics in:
  - Professional summary sections
  - Work experience responsibilities
- **Examples of bolded metrics**:
  - "Led a team of **5 engineers**"
  - "Reduced API response time by **40%**"
  - "Generated **$2M** in revenue"
  - "Serving **10,000+** daily active users"

**Benefits:**
- Improves resume readability and visual hierarchy
- Helps quantifiable achievements stand out to recruiters
- Automatically applies to all AI-parsed and AI-generated content
- Consistent formatting across all templates and export formats

**Files Modified:**
- `fastapi-backend/app/services/ai_structurer.py` - AI prompt enhancement
- `resume-generator-ai/lib/pdf/generator.ts` - PDF bold formatting support
- `resume-generator-ai/components/templates/ClassicTemplate.tsx` - Template rendering
- `resume-generator-ai/components/templates/ModernTemplate.tsx` - Template rendering
- `resume-generator-ai/components/templates/MinimalTemplate.tsx` - Template rendering
- `resume-generator-ai/lib/utils/textFormatting.ts` - New utility (created)
- `docs/CLAUDE.md` - Documentation updates

---

## Previous Releases

### Phase 2 - Resume Upload UI (Completed)
- Drag-and-drop file upload component
- AI-powered resume parsing interface
- Parsed data display with structured sections
- Save imported data to Supabase profile
- Dashboard integration with import button
- Full error handling and loading states

### Phase 1.75 - Document Parsing Backend (Completed)
- FastAPI backend for resume document parsing
- Support for PDF, DOCX, and TXT file formats
- Claude AI integration for structuring parsed content
- Next.js API proxy route (`/api/parse-resume`)
- Development scripts and Docker configuration

### Phase 1.5 - Profile Editing (Completed)
- Profile editing page with tabbed interface
- Edit personal information
- Manage work experience (add/edit/delete)
- Manage education (add/edit/delete)
- Manage skills (tag-based UI)
- API endpoints for profile updates

### Phase 1 - Foundation (Completed)
- Next.js + Supabase + Vercel setup
- Authentication (email/password + Google OAuth)
- Database schema with RLS policies
- 5-step onboarding wizard
- User dashboard with tier management
- Landing page

---

## Format Guidelines

### Categories
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Example Entry Format
```markdown
### Added - YYYY-MM-DD
- Brief description of feature
  - Implementation details
  - Benefits/impact
  - Files modified
```
