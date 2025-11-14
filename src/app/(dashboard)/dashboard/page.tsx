/**
 * Dashboard Page
 *
 * Main dashboard overview with stats and quick actions
 */

import { requireAuth, getUserProfile } from '@/lib/auth/guards'
import { DashboardMain } from '@/features/analytics/components/dashboard-main'

export default async function DashboardPage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  const userName = profile?.full_name || user.email || 'User'
  const userEmail = profile?.email || user.email || ''
  const userAvatarUrl = profile?.avatar_url

  return (
    <DashboardMain
      userName={userName}
      userEmail={userEmail}
      userAvatarUrl={userAvatarUrl}
    />
  )
}
