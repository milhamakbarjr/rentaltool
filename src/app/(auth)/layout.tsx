/**
 * Auth Layout
 *
 * Layout for authentication pages (login, register, reset password)
 * Simplified wrapper - pages handle their own styling
 */

import { requireGuest } from '@/lib/auth/guards'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Redirect to dashboard if already authenticated
  await requireGuest()

  return <>{children}</>
}
