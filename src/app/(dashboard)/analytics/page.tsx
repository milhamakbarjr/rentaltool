import { requireAuth } from '@/lib/auth/guards'
import { getTranslations } from 'next-intl/server'
import { AnalyticsMain } from '@/features/analytics/components/analytics-main'
import { createClient } from '@/lib/supabase/server'

export default async function AnalyticsPage() {
  await requireAuth()
  const t = await getTranslations('analytics')
  const supabase = await createClient()

  // Get user info for personalized greeting
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user?.id)
    .single()

  return (
    <div className="bg-primary">
      <main className="bg-primary pt-8 pb-12 lg:pt-12 lg:pb-24">
        <div className="flex flex-col gap-8">
          <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 lg:px-8">
            {/* Page header */}
            <div className="relative flex flex-col gap-5 bg-primary">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h1 className="text-display-sm font-semibold text-primary">
                    {t('title')}
                  </h1>
                  <p className="mt-1 text-md text-tertiary">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </div>

            <AnalyticsMain
              userName={profile?.full_name || user?.email || 'User'}
              userEmail={user?.email || ''}
              userAvatarUrl={profile?.avatar_url}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
