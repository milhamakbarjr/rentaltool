/**
 * Avatar Upload Utilities
 *
 * Functions for handling avatar uploads to Supabase Storage
 */

import { createClient } from '@/lib/supabase/client'

const AVATAR_BUCKET = 'avatars'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/**
 * Validate avatar file
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 2MB.',
    }
  }

  return { valid: true }
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(userId: string, file: File): Promise<{
  success: boolean
  avatarUrl?: string
  error?: string
}> {
  try {
    const supabase = createClient()

    // Validate file
    const validation = validateAvatarFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: 'Failed to upload avatar' }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath)

    return {
      success: true,
      avatarUrl: urlData.publicUrl,
    }
  } catch (error) {
    console.error('Avatar upload error:', error)
    return { success: false, error: 'Failed to upload avatar' }
  }
}

/**
 * Delete old avatar from storage
 */
export async function deleteAvatar(avatarUrl: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Extract file path from URL
    const url = new URL(avatarUrl)
    const pathParts = url.pathname.split(`${AVATAR_BUCKET}/`)
    if (pathParts.length < 2) return false

    const filePath = pathParts[1]

    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Avatar delete error:', error)
    return false
  }
}

/**
 * Update user profile with new avatar URL
 */
export async function updateProfileAvatar(
  userId: string,
  avatarUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId)

    if (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
    }

    return { success: true }
  } catch (error) {
    console.error('Profile avatar update error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}
