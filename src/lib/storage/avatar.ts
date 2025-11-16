/**
 * Avatar Upload Utilities
 *
 * Functions for handling avatar uploads to Supabase Storage with signed URLs
 * Uses private bucket with time-limited signed URLs for better security
 */

import { createClient } from '@/lib/supabase/client'

const AVATAR_BUCKET = 'avatars'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const SIGNED_URL_EXPIRY = 3600 // 1 hour in seconds

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
 * Generate signed URL for avatar with expiration time
 * @param filePath - Storage path to the avatar file
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export async function getAvatarSignedUrl(
  filePath: string,
  expiresIn: number = SIGNED_URL_EXPIRY
): Promise<string | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      console.error('Signed URL error:', error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    console.error('Avatar signed URL error:', error)
    return null
  }
}

/**
 * Upload avatar to Supabase Storage (private bucket)
 * Returns file path to be stored in database
 */
export async function uploadAvatar(userId: string, file: File): Promise<{
  success: boolean
  filePath?: string
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

    return {
      success: true,
      filePath: filePath,
    }
  } catch (error) {
    console.error('Avatar upload error:', error)
    return { success: false, error: 'Failed to upload avatar' }
  }
}

/**
 * Delete avatar from storage
 * @param filePath - Can be either a file path or a full URL
 */
export async function deleteAvatar(filePath: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Extract file path if a URL is provided
    let cleanPath = filePath

    // If it's a URL, extract the path
    if (filePath.startsWith('http')) {
      try {
        const url = new URL(filePath)
        const pathParts = url.pathname.split(`${AVATAR_BUCKET}/`)
        if (pathParts.length >= 2) {
          cleanPath = pathParts[1].split('?')[0] // Remove query params if present
        }
      } catch {
        // If URL parsing fails, try to extract path directly
        const match = filePath.match(/avatars\/(.+?)(\?|$)/)
        if (match) {
          cleanPath = match[1]
        }
      }
    }

    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove([cleanPath])

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
 * Update user profile with new avatar file path
 */
export async function updateProfileAvatar(
  userId: string,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: filePath })
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
