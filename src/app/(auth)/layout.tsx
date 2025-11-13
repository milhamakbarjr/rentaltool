/**
 * Auth Layout
 *
 * Layout for authentication pages (login, register, reset password)
 * Center-aligned form with branding
 */

import { requireGuest } from '@/lib/auth/guards'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Redirect to dashboard if already authenticated
  await requireGuest()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Branding */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">RentalTool</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your rental business with ease
          </p>
        </div>

        {/* Auth Form */}
        <div className="rounded-lg bg-white px-8 py-10 shadow-sm ring-1 ring-gray-900/5">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          © 2025 RentalTool. All rights reserved.
        </p>
      </div>
    </div>
  )
}
