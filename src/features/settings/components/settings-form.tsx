'use client'

/**
 * Settings Form
 *
 * Main settings form with tabs for Profile, Regional Settings, and Security
 */

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ProfileSection } from './profile-section'
import { RegionalSection } from './regional-section'
import { SecuritySection } from './security-section'

interface SettingsFormProps {
  userId: string
  userEmail: string
}

export function SettingsForm({ userId, userEmail }: SettingsFormProps) {
  const t = useTranslations('settings')
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
        <TabsTrigger value="regional">{t('regional')}</TabsTrigger>
        <TabsTrigger value="security">{t('security')}</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile')}</CardTitle>
            <CardDescription>
              Manage your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSection userId={userId} userEmail={userEmail} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="regional" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('regional')}</CardTitle>
            <CardDescription>
              Configure your language, currency, and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegionalSection />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('security')}</CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecuritySection />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
