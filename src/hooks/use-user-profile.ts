/**
 * useUserProfile Hook
 *
 * React hook to fetch and manage user profile data from Supabase
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './use-auth'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useUserProfile() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (fetchError) {
          console.error('Error fetching profile:', fetchError)
          setError(fetchError.message)
          return
        }

        setProfile(data)
        setError(null)
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, authLoading, supabase])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      // Log for debugging
      console.log('Updating profile for user:', user.id, 'with updates:', updates)

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .maybeSingle()

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return { error: updateError }
      }

      // Check if profile was found and updated
      if (!data) {
        console.error('No profile found for user:', user.id)
        return { error: new Error('Profile not found') }
      }

      setProfile(data)
      return { data, error: null }
    } catch (err) {
      console.error('Error:', err)
      return { error: err as Error }
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
  }
}
