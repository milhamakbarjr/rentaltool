/**
 * Settings Page
 *
 * Comprehensive settings for profile, regional preferences, and security
 */

import { requireAuth } from '@/lib/auth/guards'
import { SettingsForm } from '@/features/settings/components/settings-form'

export default async function SettingsPage() {
  const user = await requireAuth()

  return (
    <div className="h-full w-full overflow-auto">
      <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Form */}
        <SettingsForm userId={user.id} userEmail={user.email || ''} />
      </div>
    </div>
  )
}
