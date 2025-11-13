/**
 * Auth Guards
 *
 * Server-side authentication guards for protecting routes
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Require authenticated user
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  return user
}

/**
 * Require guest (not authenticated)
 * Redirects to dashboard if already authenticated
 */
export async function requireGuest() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }
}

/**
 * Get current user (returns null if not authenticated)
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return user
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}
