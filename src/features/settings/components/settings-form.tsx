'use client'

/**
 * Settings Form
 *
 * Main settings form with tabs for Profile, Regional Settings, and Security
 */

import { useTranslations } from 'next-intl'
import { TabList, Tabs } from '@/components/application/tabs/tabs'
import { ProfileSection } from './profile-section'
import { RegionalSection } from './regional-section'
import { SecuritySection } from './security-section'

interface SettingsFormProps {
  userId: string
  userEmail: string
}

export function SettingsForm({ userId, userEmail }: SettingsFormProps) {
  const t = useTranslations('settings')

  const tabs = [
    { id: 'profile', label: t('profile') },
    { id: 'regional', label: t('regional') },
    { id: 'security', label: t('security') },
  ]

  return (
    <Tabs defaultSelectedKey="profile">
      <TabList type="underline" size="md" items={tabs} className="mb-6" />

      <Tabs.Panel id="profile">
        <ProfileSection userId={userId} userEmail={userEmail} />
      </Tabs.Panel>

      <Tabs.Panel id="regional">
        <RegionalSection />
      </Tabs.Panel>

      <Tabs.Panel id="security">
        <SecuritySection />
      </Tabs.Panel>
    </Tabs>
  )
}
