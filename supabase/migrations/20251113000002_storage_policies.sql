-- RentalTool Storage Bucket Policies
-- Migration: 20251113000002_storage_policies
-- Description: Create storage buckets and RLS policies for file uploads

-- ==============================================
-- STORAGE BUCKETS
-- ==============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'item-images',
    'item-images',
    true, -- Public bucket for item images
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
  ),
  (
    'condition-photos',
    'condition-photos',
    false, -- Private bucket for pickup/return condition photos
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
  ),
  (
    'receipts',
    'receipts',
    false, -- Private bucket for receipts
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'application/pdf']
  )
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- STORAGE POLICIES
-- ==============================================

-- Item Images Bucket Policies (Public)
-- Anyone can view (public bucket)
-- Only authenticated users can upload/update/delete their own images

CREATE POLICY "Public can view item images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Users can upload item images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'item-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own item images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'item-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own item images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'item-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Condition Photos Bucket Policies (Private)
-- Only authenticated users can access their own photos

CREATE POLICY "Users can view their own condition photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'condition-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload condition photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'condition-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own condition photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'condition-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own condition photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'condition-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Receipts Bucket Policies (Private)
-- Only authenticated users can access their own receipts

CREATE POLICY "Users can view their own receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own receipts"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'receipts'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own receipts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'receipts'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ==============================================
-- STORAGE HELPER FUNCTIONS
-- ==============================================

-- Function to generate a unique filename
CREATE OR REPLACE FUNCTION public.generate_unique_filename(
  p_original_filename TEXT,
  p_user_id UUID
)
RETURNS TEXT AS $$
DECLARE
  v_extension TEXT;
  v_filename TEXT;
BEGIN
  -- Extract file extension
  v_extension := SUBSTRING(p_original_filename FROM '\.([^.]+)$');

  -- Generate unique filename: user_id/timestamp-uuid.ext
  v_filename := p_user_id::TEXT || '/' ||
                EXTRACT(EPOCH FROM NOW())::BIGINT || '-' ||
                gen_random_uuid()::TEXT || '.' || v_extension;

  RETURN v_filename;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- COMMENTS
-- ==============================================

COMMENT ON FUNCTION public.generate_unique_filename IS 'Generates a unique filename for storage uploads with user_id prefix';
