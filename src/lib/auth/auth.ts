/**
 * Authentication Utilities
 *
 * Helper functions for authentication operations
 */

import { createClient } from '@/lib/supabase/client'
import type { Provider } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  fullName?: string
  businessName?: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password, fullName, businessName }: SignUpData) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        business_name: businessName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    return { user: null, error }
  }

  // Create profile after sign up
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName || null,
        business_name: businessName || null,
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Continue anyway, profile might already exist
    }
  }

  return { user: data.user, error: null }
}

/**
 * Sign in with email and password
 */
export async function signIn({ email, password }: SignInData) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, session: null, error }
  }

  return { user: data.user, session: data.session, error: null }
}

/**
 * Sign in with OAuth provider (Google, GitHub, etc.)
 */
export async function signInWithProvider(provider: Provider) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  return { data, error }
}

/**
 * Update password (must be called after reset)
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  return { data, error }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  return { user, error }
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createClient()

  const { data: { session }, error } = await supabase.auth.getSession()

  return { session, error }
}
