-- Add avatar_url column to profiles table
-- Migration: 20251117000001_add_avatar_url_to_profiles
-- Description: Add avatar_url field to store user profile pictures

-- Add avatar_url column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.avatar_url IS 'File path for user avatar in Supabase Storage (avatars bucket)';
