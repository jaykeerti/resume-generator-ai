# Subscription Management Guide

## Overview
This guide explains how to manage user subscription tiers and generation limits in the Resume Generator AI application.

## 🎯 Subscription Tiers

### Free Tier
- **Limit**: 5 resume exports
- **Cost**: $0
- **Features**:
  - Full profile management
  - Unlimited resume creation (editing)
  - Limited PDF exports (5 total)
  - All templates available

### Pro Tier
- **Limit**: Unlimited resume exports
- **Cost**: TBD (payment integration in Phase 6)
- **Features**:
  - Unlimited PDF exports
  - Priority support (future)
  - Advanced templates (future)
  - Resume analytics (future)

## 📊 Database Schema

### users_profile Table
```sql
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  generation_count INTEGER NOT NULL DEFAULT 0,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_id TEXT,  -- Stripe customer ID (Phase 6)
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

**Key Fields:**
- `generation_count`: Number of PDF exports used (only tracked for free tier)
- `subscription_tier`: Either 'free' or 'pro'
- `subscription_id`: Reserved for Stripe integration (future)

## 🔧 Manual Subscription Management

### Upgrade User to Pro Tier

**Method 1: SQL Query (Recommended)**
```sql
-- Upgrade specific user to Pro
UPDATE users_profile
SET subscription_tier = 'pro'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'user@example.com'
);
```

**Method 2: Supabase Dashboard**
1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Select `users_profile` table
4. Find the user's row
5. Edit `subscription_tier` column
6. Change value from `'free'` to `'pro'`
7. Save changes

### Reset Generation Count

**For testing or special cases:**
```sql
-- Reset generation count to 0
UPDATE users_profile
SET generation_count = 0
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'user@example.com'
);
```

### Downgrade User to Free Tier

```sql
-- Downgrade user and reset count
UPDATE users_profile
SET
  subscription_tier = 'free',
  generation_count = 0
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'user@example.com'
);
```

## 🔍 Query Examples

### Check User Subscription Status
```sql
SELECT
  u.email,
  p.subscription_tier,
  p.generation_count,
  p.onboarding_completed,
  p.created_at
FROM auth.users u
JOIN users_profile p ON u.id = p.id
WHERE u.email = 'user@example.com';
```

### List All Pro Users
```sql
SELECT
  u.email,
  p.subscription_tier,
  p.created_at as upgraded_at
FROM auth.users u
JOIN users_profile p ON u.id = p.id
WHERE p.subscription_tier = 'pro'
ORDER BY p.updated_at DESC;
```

### Find Users Near Limit
```sql
SELECT
  u.email,
  p.generation_count,
  (5 - p.generation_count) as remaining
FROM auth.users u
JOIN users_profile p ON u.id = p.id
WHERE
  p.subscription_tier = 'free'
  AND p.generation_count >= 3
ORDER BY p.generation_count DESC;
```

## 💡 How It Works in the App

### Export Limit Check
When a user clicks "Download PDF":
1. App checks `subscription_tier`
2. If `'pro'` → Allow export (no limit)
3. If `'free'` → Check `generation_count`
   - If < 5 → Allow export, increment counter
   - If >= 5 → Show upgrade modal

**Code Reference**: `app/api/resume/[id]/export/route.ts`

### UI Display
Dashboard shows different messages based on tier:

**Free Tier:**
```
Free Plan
3 / 5 resume generations remaining
[Upgrade to Pro]
```

**Pro Tier:**
```
Pro Plan
Unlimited resume generations
```

**Code Reference**: `components/dashboard/DashboardContent.tsx:154-180`

## 🧪 Testing Subscription Features

### Test Free Tier Limits
1. Create test user account
2. Generate and download 5 resumes
3. Verify limit reached message appears
4. Confirm 6th download is blocked

### Test Pro Tier
1. Upgrade test user to Pro (SQL query)
2. Verify UI shows "Unlimited" message
3. Download 10+ resumes
4. Confirm no limits enforced

### Test Counter Reset
1. Reset generation_count to 0
2. Verify counter displays correctly
3. Download resume
4. Confirm counter increments

## 🚨 Common Issues & Solutions

### Issue: User upgraded but still sees limit
**Solution:**
```sql
-- Verify subscription tier is set
SELECT subscription_tier FROM users_profile
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- If still 'free', update it
UPDATE users_profile SET subscription_tier = 'pro'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

### Issue: Counter not incrementing
**Solution:**
- Check API route `/api/resume/[id]/export/route.ts`
- Verify database update is being called
- Check for error logs in Supabase

### Issue: Pro user seeing count
**Solution:**
- Pro users shouldn't see counter
- Check `DashboardContent.tsx` conditional rendering
- Verify `subscription_tier === 'pro'` check

## 🔮 Future: Stripe Integration (Phase 6)

When Stripe payment integration is added:

### Webhook Events to Handle
```javascript
// stripe.subscription.created
// stripe.subscription.updated
// stripe.subscription.deleted
// stripe.payment_succeeded
// stripe.payment_failed
```

### subscription_history Table
Track all subscription changes:
```sql
SELECT * FROM subscription_history
WHERE user_id = 'xxx'
ORDER BY created_at DESC;
```

### Automated Updates
Instead of manual SQL, webhooks will:
1. Receive Stripe event
2. Verify webhook signature
3. Update `users_profile.subscription_tier`
4. Log to `subscription_history`
5. Send confirmation email

## 📚 Related Files

**Database:**
- `supabase/migrations/20250104000001_initial_schema.sql` - Schema definition

**API Routes:**
- `app/api/resume/[id]/export/route.ts` - Export limit logic

**Components:**
- `components/dashboard/DashboardContent.tsx` - Tier display
- `components/dashboard/ProfileSummaryCard.tsx` - Profile card

**Documentation:**
- `Readme.md` - Feature specification
- `PHASE1.5_COMPLETE.md` - Profile features

## 🎯 Quick Reference

### Upgrade User to Pro
```sql
UPDATE users_profile SET subscription_tier = 'pro'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

### Check User Status
```sql
SELECT u.email, p.subscription_tier, p.generation_count
FROM auth.users u JOIN users_profile p ON u.id = p.id
WHERE u.email = 'user@example.com';
```

### Reset Counter
```sql
UPDATE users_profile SET generation_count = 0
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

---

**Last Updated**: January 2025
**Stripe Integration**: Planned for Phase 6
**Current Manual Management**: SQL queries via Supabase Dashboard
