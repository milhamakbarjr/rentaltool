/**
 * Dashboard Layout
 *
 * Protected layout for authenticated users
 * Includes navigation and user menu
 */

import { requireAuth, getUserProfile } from '@/lib/auth/guards'
import { DashboardHeaderNavigation } from '@/components/application/app-navigation/dashboard-header-navigation'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Require authentication
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  const userName = profile?.full_name || user.email || 'User'
  const userEmail = profile?.email || user.email || ''
  const userAvatarUrl = profile?.avatar_url

  return (
    <div className="min-h-screen bg-primary">
      {/* Top Navigation */}
      <DashboardHeaderNavigation
        userName={userName}
        userEmail={userEmail}
        userAvatarUrl={userAvatarUrl}
      />

      {/* Main Content */}
      {children}
    </div>
  )
}
