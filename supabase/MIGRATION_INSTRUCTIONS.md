# Database Migration Instructions

## Avatar Feature Migrations

To enable the avatar upload feature in production, you need to run the following migrations on your Supabase database.

### Required Migrations

1. **20251117000001_add_avatar_url_to_profiles.sql** - Adds `avatar_url` column to profiles table
2. **20251117000002_add_avatars_storage_bucket.sql** - Creates avatars storage bucket with RLS policies

### How to Apply Migrations

#### Step 1: Add avatar_url Column (SQL Editor)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `rentaltool`
3. Navigate to **SQL Editor** in the left sidebar
4. Create a new query
5. Copy the contents of `20251117000001_add_avatar_url_to_profiles.sql`
6. Paste and click **Run**
7. You should see: "Success. No rows returned"

#### Step 2: Create Avatars Storage Bucket (Storage UI)

**Why not use SQL?** Storage policies require special permissions that the SQL Editor doesn't have. The UI is the recommended approach.

1. In your Supabase Dashboard, navigate to **Storage** in the left sidebar
2. Click **"New bucket"** button
3. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ❌ **OFF** (keep it private for security)
   - **File size limit**: `2 MB` (2097152 bytes)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
4. Click **"Create bucket"**

#### Step 3: Create Storage Policies (Storage UI)

1. Still in **Storage**, click on the `avatars` bucket you just created
2. Go to the **"Policies"** tab at the top
3. Click **"New Policy"**

**Create 4 policies (repeat for each):**

**Policy 1: SELECT (View)**
- **Policy name**: `Users can view their own avatars`
- **Allowed operation**: `SELECT`
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  (bucket_id = 'avatars'::text) AND
  ((storage.foldername(name))[1] = (auth.uid())::text)
  ```

**Policy 2: INSERT (Upload)**
- **Policy name**: `Users can upload their own avatars`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**:
  ```sql
  (bucket_id = 'avatars'::text) AND
  ((storage.foldername(name))[1] = (auth.uid())::text)
  ```

**Policy 3: UPDATE (Modify)**
- **Policy name**: `Users can update their own avatars`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  (bucket_id = 'avatars'::text) AND
  ((storage.foldername(name))[1] = (auth.uid())::text)
  ```

**Policy 4: DELETE (Remove)**
- **Policy name**: `Users can delete their own avatars`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**:
  ```sql
  (bucket_id = 'avatars'::text) AND
  ((storage.foldername(name))[1] = (auth.uid())::text)
  ```

#### Quick Summary

1. ✅ **SQL Editor**: Run `20251117000001_add_avatar_url_to_profiles.sql` to add the column
2. ✅ **Storage UI**: Create `avatars` bucket (private, 2MB limit)
3. ✅ **Storage Policies**: Create 4 policies (SELECT, INSERT, UPDATE, DELETE)

### Verification

After running the migrations, verify they were applied successfully:

1. **Check profiles table**:
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'profiles' AND column_name = 'avatar_url';
   ```
   Should return: `avatar_url | text`

2. **Check storage bucket**:
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'avatars';
   ```
   Should return a row with `id = 'avatars'` and `public = false`

3. **Check storage policies**:
   ```sql
   SELECT policyname FROM pg_policies
   WHERE tablename = 'objects'
   AND policyname LIKE '%avatars%';
   ```
   Should return 4 policies for avatars

### Troubleshooting

**Error: "relation already exists"**
- This means the migration was already applied. You can safely ignore this error.

**Error: "permission denied"**
- Make sure you're connected with the correct database credentials
- Check that your user has `CREATE` and `ALTER` permissions

**Error: "bucket already exists"**
- The avatars bucket was already created. You can skip the bucket creation or use `ON CONFLICT DO NOTHING`

### Rollback (if needed)

If you need to rollback these migrations:

```sql
-- Remove avatar_url column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar_url;

-- Remove storage policies
DROP POLICY IF EXISTS "Users can view their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Remove storage bucket (WARNING: This will delete all avatars!)
DELETE FROM storage.buckets WHERE id = 'avatars';
```

## Next Steps

After applying the migrations:
1. Test avatar upload in your staging environment first
2. Monitor error logs for any RLS policy issues
3. Verify signed URLs are working correctly
4. Deploy the frontend changes to production
