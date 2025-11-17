-- Add avatars storage bucket
-- Migration: 20251117000002_add_avatars_storage_bucket
-- Description: Create avatars storage bucket with RLS policies for user profile pictures

-- ==============================================
-- STORAGE BUCKET
-- ==============================================

-- Create avatars bucket (private for security)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'avatars',
    'avatars',
    false, -- Private bucket - access via signed URLs
    2097152, -- 2MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- STORAGE POLICIES
-- ==============================================

-- Users can view their own avatars
CREATE POLICY "Users can view their own avatars"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can upload their own avatars
CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own avatars
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own avatars
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ==============================================
-- COMMENTS
-- ==============================================

COMMENT ON POLICY "Users can view their own avatars" ON storage.objects IS 'Allow users to view their own avatar files';
COMMENT ON POLICY "Users can upload their own avatars" ON storage.objects IS 'Allow users to upload their own avatar files';
COMMENT ON POLICY "Users can update their own avatars" ON storage.objects IS 'Allow users to update their own avatar files';
COMMENT ON POLICY "Users can delete their own avatars" ON storage.objects IS 'Allow users to delete their own avatar files';
