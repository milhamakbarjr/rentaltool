/**
 * Dashboard Layout
 *
 * Protected layout for authenticated users
 * Includes navigation and user menu
 */

import { requireAuth, getUserProfile } from '@/lib/auth/guards'
import { signOut } from '@/lib/auth/auth'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ROUTES } from '@/utils/constants'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

async function SignOutButton() {
  'use server'
  const t = await getTranslations('auth')

  async function handleSignOut() {
    'use server'
    await signOut()
  }

  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        {t('logout')}
      </button>
    </form>
  )
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Require authentication
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)
  const t = await getTranslations('navigation')
  const tSettings = await getTranslations('settings')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            {/* Logo */}
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href={ROUTES.DASHBOARD} className="text-xl font-bold text-gray-900">
                  RentalTool
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href={ROUTES.DASHBOARD}
                  className="inline-flex items-center border-b-2 border-purple-500 px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  {t('dashboard')}
                </Link>
                <Link
                  href={ROUTES.RENTALS}
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  {t('rentals')}
                </Link>
                <Link
                  href={ROUTES.CUSTOMERS}
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  {t('customers')}
                </Link>
                <Link
                  href={ROUTES.INVENTORY}
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  {t('inventory')}
                </Link>
                <Link
                  href={ROUTES.SETTINGS}
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  {tSettings('title')}
                </Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.full_name || profile?.email || user.email}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {(profile?.full_name || profile?.email || user.email || '?')[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
