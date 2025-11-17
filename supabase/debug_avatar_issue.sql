-- Debug SQL Queries for Avatar Issue
-- Run these in Supabase Dashboard -> SQL Editor to diagnose the problem

-- ==============================================
-- 1. Check if avatar_url column exists
-- ==============================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'avatar_url';

-- Expected result: Should return 1 row with avatar_url | text | YES
-- If no rows returned: The migration didn't run successfully

-- ==============================================
-- 2. Check if profile exists for your user
-- ==============================================
-- Replace 'your-user-id' with: 05fe3fdc-1e57-43b7-b6c6-dc286dd09740
SELECT id, email, full_name, business_name, avatar_url, created_at
FROM public.profiles
WHERE id = '05fe3fdc-1e57-43b7-b6c6-dc286dd09740';

-- Expected result: Should return 1 row with your profile data
-- If no rows returned: Profile doesn't exist - you need to create it

-- ==============================================
-- 3. Check RLS policies on profiles table
-- ==============================================
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Expected result: Should show 3 policies (SELECT, UPDATE, INSERT)
-- Make sure UPDATE policy exists

-- ==============================================
-- 4. Test if you can manually update the profile
-- ==============================================
-- This simulates what the app is trying to do
-- Replace 'your-user-id' with: 05fe3fdc-1e57-43b7-b6c6-dc286dd09740
UPDATE public.profiles
SET
  full_name = 'Test Update',
  business_name = 'Test Business',
  avatar_url = 'test/path.png'
WHERE id = '05fe3fdc-1e57-43b7-b6c6-dc286dd09740'
RETURNING *;

-- Expected result: Should return the updated row
-- If error: Check the error message for clues

-- ==============================================
-- 5. Create profile if it doesn't exist
-- ==============================================
-- ONLY run this if query #2 returned no rows
-- Replace values with your actual data
INSERT INTO public.profiles (id, email, full_name, business_name)
VALUES (
  '05fe3fdc-1e57-43b7-b6c6-dc286dd09740',
  'your-email@example.com',  -- Replace with your actual email
  'Admin 1',
  'Jas Blitar'
)
ON CONFLICT (id) DO NOTHING
RETURNING *;

-- ==============================================
-- 6. Check auth user exists
-- ==============================================
SELECT id, email, created_at
FROM auth.users
WHERE id = '05fe3fdc-1e57-43b7-b6c6-dc286dd09740';

-- Expected result: Should return 1 row
-- If no rows: The user doesn't exist in auth.users (big problem!)
