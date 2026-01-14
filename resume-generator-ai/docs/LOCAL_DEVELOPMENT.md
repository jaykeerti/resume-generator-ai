# Local Supabase Development Guide

This guide explains how to run the resume generator app with a local Supabase instance for faster development without network latency.

## Quick Start

### 1. Start Local Supabase

```bash
cd resume-generator-ai
npm run supabase:start
```

This will:
- Download and start Docker containers for PostgreSQL, Auth, Storage, etc.
- Apply all migrations from `supabase/migrations/`
- Output connection details (save these!)

**Important**: Copy the `anon key` and `service_role key` from the output - you'll need them for the next step.

### 2. Configure Environment Variables

Create `.env.local` with local Supabase credentials:

```env
# Local Supabase (from `npm run supabase:start` output)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste_anon_key_here>
SUPABASE_SERVICE_ROLE_KEY=<paste_service_role_key_here>

# Copy from your existing .env.local
OPENAI_API_KEY=<your_openai_key>
STRIPE_SECRET_KEY=<your_stripe_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>

NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_ENV=local
```

### 3. Start Next.js Dev Server

```bash
npm run dev
```

### 4. Create a Test User

```bash
npm run seed:user
```

This creates a test account:
- Email: `test@example.com`
- Password: `test123456`

You can also create custom users:
```bash
node scripts/create-local-user.mjs your@email.com yourpassword
```

### 5. Access the App

- **App**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323 (database admin UI)

Sign in with your test account and start developing!

---

## Switching Between Local and Remote

### Save Remote Configuration (First Time Only)

Before switching to local, backup your remote configuration:

```bash
copy .env.local .env.local.remote
```

### Use Local Supabase

```bash
# 1. Make sure local Supabase is running
npm run supabase:start

# 2. Update .env.local with local credentials (see step 2 above)

# 3. Restart dev server
npm run dev
```

### Use Remote Supabase

```bash
# 1. Restore remote environment
copy .env.local.remote .env.local

# 2. Restart dev server (Ctrl+C, then)
npm run dev
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run supabase:start` | Start local Supabase (Docker containers) |
| `npm run supabase:stop` | Stop local Supabase |
| `npm run supabase:status` | Check status and connection details |
| `npm run supabase:reset` | Reset database (reapply all migrations) |
| `npm run seed:user` | Create test user (test@example.com) |

---

## Accessing Services

### Supabase Studio (Database Admin UI)

URL: http://localhost:54323

Features:
- Browse tables and data
- Run SQL queries
- View logs
- Manage authentication users
- Test API endpoints

### Direct Database Connection

```
postgresql://postgres:postgres@localhost:54322/postgres
```

Use with `psql`, pgAdmin, or any PostgreSQL client.

---

## Troubleshooting

### "Port already in use"

Another Supabase instance or conflicting service is running.

```bash
# Stop Supabase
npm run supabase:stop

# Check for stuck containers
docker ps -a

# Remove if needed
docker rm -f <container_id>
```

### "Migrations not applied"

Reset the database:

```bash
npm run supabase:reset
```

This drops all data and reapplies migrations.

### "Can't connect to database"

Check if containers are running:

```bash
npm run supabase:status
```

If services are down:

```bash
npm run supabase:stop
npm run supabase:start
```

### "Docker is not running"

Start Docker Desktop and wait for it to fully initialize, then run:

```bash
npm run supabase:start
```

### Code changes not reflecting

The local Supabase client is cached. If you made changes to `lib/supabase/server.ts` or `lib/supabase/env.ts`:

```bash
# Restart dev server
# Press Ctrl+C, then
npm run dev
```

---

## Performance Comparison

| Operation | Remote Supabase | Local Supabase | Improvement |
|-----------|-----------------|----------------|-------------|
| Simple query | 200-500ms | 10-50ms | **5-10x faster** |
| Auth check | 100-300ms | <10ms | **10-30x faster** |
| Dashboard load | 1-2s | 100-200ms | **5-10x faster** |

---

## Data Management

### Creating Test Data

The `npm run seed:user` command creates a basic test user. To add more realistic data:

1. Sign up with the test account
2. Complete the onboarding flow
3. Create job descriptions and resumes through the UI
4. Or use Supabase Studio to insert data directly

### Resetting Data

To start fresh:

```bash
npm run supabase:reset
npm run seed:user
```

This deletes all data and recreates the schema.

### Syncing Schema Changes

If you or a teammate adds new migrations:

```bash
git pull
npm run supabase:reset
```

This ensures your local database matches the latest schema.

---

## Working with Migrations

### Viewing Migrations

Migrations are in `supabase/migrations/`:
- `20250104000001_initial_schema.sql` - Tables, RLS policies, indexes
- `20250104000002_seed_ai_config.sql` - AI configuration data

### Creating New Migrations

```bash
npx supabase migration new your_migration_name
```

Edit the generated file in `supabase/migrations/`, then test locally:

```bash
npm run supabase:reset
```

### Applying to Remote

Local migrations are NOT automatically applied to remote. To apply:

1. Test thoroughly locally
2. Open remote Supabase Studio: https://app.supabase.com/project/cdbfksuhdnmzwgxjefwq
3. Go to SQL Editor
4. Copy/paste migration SQL
5. Run it
6. Commit migration file to git

---

## Tips for Local Development

### Use Local for Most Development

- Faster iteration
- No network dependency
- Safe to experiment (easy to reset)
- Free from API rate limits

### Use Remote For

- Testing production data
- Verifying deploys
- Debugging production-specific issues
- Testing with real Stripe webhooks

### Best Practices

1. **Always start Supabase first**: Run `npm run supabase:start` before `npm run dev`
2. **Check status if things fail**: `npm run supabase:status` shows if services are running
3. **Reset when schema changes**: After pulling new migrations, run `npm run supabase:reset`
4. **Use Studio for debugging**: http://localhost:54323 is invaluable for inspecting data

---

## Docker Resources

Supabase runs multiple Docker containers. Typical resource usage:

- **RAM**: ~1.5-2GB
- **Disk**: ~1GB for images + data
- **CPU**: Low (idle), moderate (during queries)

To free up resources when not developing:

```bash
npm run supabase:stop
```

---

## Need Help?

- **Supabase CLI docs**: https://supabase.com/docs/guides/cli
- **Supabase local development**: https://supabase.com/docs/guides/local-development
- **Project issues**: Check the main README or CLAUDE.md

---

## Summary

**To start local development:**
1. `npm run supabase:start` (first time: save the keys!)
2. Update `.env.local` with local URLs and keys
3. `npm run dev`
4. `npm run seed:user`
5. Visit http://localhost:3000

**To switch back to remote:**
1. `copy .env.local.remote .env.local`
2. Restart dev server

Enjoy 5-10x faster database queries during local development!
