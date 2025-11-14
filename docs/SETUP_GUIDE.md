# RentalTool - Project Setup Guide

Complete step-by-step guide to set up the RentalTool development environment and deploy to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Environment Variables](#environment-variables)
5. [Install Dependencies](#install-dependencies)
6. [Database Setup](#database-setup)
7. [Run Development Server](#run-development-server)
8. [Verify Setup](#verify-setup)
9. [Deploy to Vercel](#deploy-to-vercel)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- [ ] **Node.js 20+** installed ([Download](https://nodejs.org/))
- [ ] **Bun** package manager installed ([Download](https://bun.sh/))
- [ ] **Git** installed
- [ ] **Supabase account** ([Sign up](https://supabase.com/))
- [ ] **Vercel account** ([Sign up](https://vercel.com/)) - for deployment
- [ ] **Code editor** (VS Code recommended)

### Verify installations:

```bash
node --version  # Should be v20.x or higher
bun --version   # Should be 1.x or higher
git --version   # Any recent version
```

---

## Initial Setup

### 1. Clone the Repository

```bash
# If starting fresh (already done in your case)
git clone <your-repo-url>
cd rentaltool

# Or if already in the directory
git pull origin main
```

### 2. Check Project Structure

Your project should have this structure:

```
rentaltool/
├── docs/
│   ├── PRD.md
│   └── SETUP_GUIDE.md
├── supabase/
│   ├── migrations/
│   │   ├── 20251113000001_initial_schema.sql
│   │   └── 20251113000002_storage_policies.sql
│   └── README.md
├── src/
│   └── app/
├── public/
├── package.json
├── next.config.mjs
├── tsconfig.json
└── README.md
```

---

## Supabase Configuration

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard:**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Click **"New Project"**

2. **Configure Project:**
   ```
   Organization: Create new or select existing
   Name: rentaltool (or your preferred name)
   Database Password: <Generate a strong password> ⚠️ SAVE THIS!
   Region: Asia Pacific (ap-southeast-1) - Singapore
   Pricing Plan: Free
   ```

3. **Wait for project creation** (~2 minutes)

4. **Save Project Details:**
   - Project URL: `https://YOUR_PROJECT_REF.supabase.co`
   - Project API Key (anon, public): Found in Settings > API
   - Project API Key (service_role, secret): Found in Settings > API ⚠️ NEVER expose this!

### Step 2: Run Database Migrations

#### Option A: Using Supabase Dashboard (Easiest)

1. Open your Supabase project
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy entire contents of `supabase/migrations/20251113000001_initial_schema.sql`
5. Paste into SQL Editor
6. Click **"Run"**
7. Wait for success message (should show "Success, no rows returned")
8. Repeat for `supabase/migrations/20251113000002_storage_policies.sql`

#### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
# Enter your database password when prompted

# Push migrations
supabase db push

# Generate TypeScript types (optional but recommended)
supabase gen types typescript --linked > src/types/supabase.ts
```

### Step 3: Verify Database Setup

1. Go to **Table Editor** in Supabase Dashboard
2. You should see tables: `profiles`, `categories`, `inventory_items`, `customers`, `rentals`, `rental_items`, `payments`, `expenses`
3. Go to **Authentication > Policies**
4. Verify RLS is enabled on all tables (green checkmark)
5. Go to **Storage**
6. Verify buckets exist: `item-images`, `condition-photos`, `receipts`

---

## Environment Variables

### Step 1: Create Environment File

Create a `.env.local` file in the project root:

```bash
# In the rentaltool directory
touch .env.local
```

### Step 2: Add Supabase Variables

Open `.env.local` and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Service Role Key (for admin operations, keep SECRET!)
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Get Your Keys

1. Go to your Supabase project
2. Navigate to **Settings > API**
3. Copy **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy **Project API keys > anon public** → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Verify .env.local is Gitignored

Check `.gitignore` includes:

```gitignore
.env.local
.env*.local
```

⚠️ **NEVER commit `.env.local` to Git!**

---

## Install Dependencies

### Step 1: Install Required Packages

```bash
# Install all dependencies
bun install

# Install additional required packages
bun add @supabase/supabase-js @supabase/auth-helpers-nextjs
bun add zustand @tanstack/react-query
bun add zod react-hook-form @hookform/resolvers
bun add date-fns clsx tailwind-merge nanoid

# Install dev dependencies
bun add -D @types/node
```

### Step 2: Verify Installation

```bash
# Check package.json has all dependencies
cat package.json | grep -A 20 "dependencies"
```

Expected packages:
- ✅ @supabase/supabase-js
- ✅ @supabase/auth-helpers-nextjs
- ✅ zustand
- ✅ @tanstack/react-query
- ✅ zod
- ✅ react-hook-form
- ✅ date-fns

---

## Database Setup

### Step 1: Test Database Connection

Create a test file `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
export async function testConnection() {
  const { data, error } = await supabase
    .from('profiles')
    .select('count')

  if (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }

  console.log('✅ Supabase connection successful')
  return true
}
```

### Step 2: Run Connection Test

```bash
# Create a test script
node -e "import('./src/lib/supabase.js').then(m => m.testConnection())"
```

You should see: `✅ Supabase connection successful`

---

## Run Development Server

### Step 1: Start Dev Server

```bash
bun dev
```

You should see:

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### Step 2: Open in Browser

Open [http://localhost:3000](http://localhost:3000)

You should see the Untitled UI starter page.

### Step 3: Check Console

Open browser DevTools (F12) and check console for any errors.

---

## Verify Setup

### Checklist

Run through this checklist to ensure everything is working:

- [ ] **Supabase project created** in Asia Pacific region
- [ ] **Database migrations ran successfully** (all tables created)
- [ ] **RLS policies enabled** on all tables
- [ ] **Storage buckets created** (3 buckets)
- [ ] **Environment variables set** in `.env.local`
- [ ] **Dependencies installed** (node_modules exists)
- [ ] **Development server runs** without errors
- [ ] **No console errors** in browser
- [ ] **Supabase client connects** successfully

### Test Database Access

Create a simple test page `src/app/test-db/page.tsx`:

```typescript
import { createClient } from '@supabase/supabase-js'

export default async function TestPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .limit(5)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      {error ? (
        <div className="text-red-600">
          <p>❌ Error: {error.message}</p>
        </div>
      ) : (
        <div className="text-green-600">
          <p>✅ Database connected successfully!</p>
          <p>Categories found: {data?.length || 0}</p>
        </div>
      )}
    </div>
  )
}
```

Visit [http://localhost:3000/test-db](http://localhost:3000/test-db)

You should see: "✅ Database connected successfully!"

---

## Deploy to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New Project"**
3. **Import Git Repository:**
   - Connect your GitHub account
   - Select `rentaltool` repository
   - Click "Import"

4. **Configure Project:**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: bun run build
   Output Directory: .next
   Install Command: bun install
   ```

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

6. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-app.vercel.app`

### Step 3: Verify Production Deployment

1. Visit your Vercel URL
2. Test the `/test-db` page
3. Check Vercel logs for any errors

### Step 4: Set Up Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` in environment variables

---

## Troubleshooting

### Issue: "Module not found: Can't resolve '@supabase/supabase-js'"

**Solution:**
```bash
bun add @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Issue: "Error: Invalid Supabase URL or Key"

**Solution:**
1. Check `.env.local` has correct values
2. Verify no trailing spaces in environment variables
3. Restart dev server: `bun dev`

### Issue: "RLS policy violation" when querying database

**Solution:**
1. Verify you're authenticated (logged in)
2. Check RLS policies in Supabase Dashboard
3. Ensure `auth.uid()` matches `user_id` in queries

### Issue: Storage bucket upload fails

**Solution:**
1. Check bucket exists in Storage tab
2. Verify storage policies are set (run storage migration)
3. Check file path format: `{user_id}/filename`

### Issue: Build fails on Vercel

**Solution:**
1. Check all environment variables are set in Vercel
2. Verify `package.json` has all dependencies
3. Check Vercel logs for specific error
4. Try building locally: `bun run build`

### Issue: "Cannot find module 'zod'" or similar

**Solution:**
```bash
# Reinstall all dependencies
rm -rf node_modules
rm bun.lockb
bun install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 bun dev
```

---

## Next Steps

After completing setup, proceed with:

1. ✅ **Configure Supabase client** in `src/lib/supabase.ts`
2. ✅ **Set up authentication** with Supabase Auth helpers
3. ✅ **Create project folder structure** (lib, components, hooks, etc.)
4. ✅ **Set up Zustand stores** for state management
5. ✅ **Configure TanStack Query** for data fetching
6. ✅ **Create Zod schemas** for validation
7. ✅ **Build authentication flow** (login, register, logout)
8. ✅ **Build first feature** (rental entry or inventory management)

---

## Useful Commands

```bash
# Development
bun dev                    # Start dev server
bun build                  # Build for production
bun start                  # Start production server
bun lint                   # Run ESLint

# Supabase
supabase status            # Check Supabase status
supabase db reset          # Reset local database
supabase db push           # Push migrations to remote
supabase gen types typescript --linked > src/types/supabase.ts  # Generate types

# Git
git status                 # Check git status
git add .                  # Stage all changes
git commit -m "message"    # Commit changes
git push                   # Push to remote

# Vercel
vercel                     # Deploy to Vercel
vercel --prod              # Deploy to production
vercel logs                # View deployment logs
```

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Zustand Docs:** https://zustand-demo.pmnd.rs/
- **TanStack Query:** https://tanstack.com/query/latest
- **Zod Docs:** https://zod.dev/
- **Vercel Docs:** https://vercel.com/docs

---

## Security Checklist

Before going to production:

- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit API keys to Git
- [ ] RLS policies enabled on all tables
- [ ] Service role key (if used) only in server-side code
- [ ] CORS configured properly in Supabase
- [ ] Content Security Policy configured
- [ ] Rate limiting configured (Vercel/Supabase)
- [ ] Error logging set up (Sentry)
- [ ] Database backups configured

---

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review Supabase/Next.js documentation
3. Check project GitHub Issues
4. Ask in project Discord/Slack (if available)

---

**Setup complete! 🎉 You're ready to start building RentalTool.**
