/**
 * Supabase Client - Browser
 *
 * This client is used for client-side operations (React components, hooks)
 * Uses the anon key which respects Row Level Security (RLS) policies
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
