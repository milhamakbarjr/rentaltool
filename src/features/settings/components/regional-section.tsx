'use client'

/**
 * Regional Section
 *
 * Form for managing regional preferences (language, currency, timezone, date format)
 */

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { IconNotification } from '@/components/application/notifications/notifications'
import { setUserLocale } from '@/i18n/locale'
import { localeConfigs, type Locale, currencies, timezones } from '@/i18n/config'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const regionalSchema = z.object({
  language: z.enum(['id', 'en']),
  currency: z.string(),
  timezone: z.string(),
  dateFormat: z.string(),
})

type RegionalFormData = z.infer<typeof regionalSchema>

const dateFormats = [
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (31/12/2024)' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (12/31/2024)' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2024-12-31)' },
  { value: 'dd MMM yyyy', label: 'DD MMM YYYY (31 Dec 2024)' },
]

export function RegionalSection() {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    setValue,
    watch,
    handleSubmit,
  } = useForm<RegionalFormData>({
    resolver: zodResolver(regionalSchema),
    defaultValues: {
      language: 'id',
      currency: 'IDR',
      timezone: 'Asia/Jakarta',
      dateFormat: 'dd/MM/yyyy',
    },
  })

  const currentLanguage = watch('language')
  const currentCurrency = watch('currency')
  const currentTimezone = watch('timezone')
  const currentDateFormat = watch('dateFormat')

  const onSubmit = async (data: RegionalFormData) => {
    try {
      setIsLoading(true)

      // Set user locale (language)
      await setUserLocale(data.language as Locale)

      // Save other preferences to localStorage for now
      // In a real app, you'd save these to the user's profile in the database
      localStorage.setItem('user_currency', data.currency)
      localStorage.setItem('user_timezone', data.timezone)
      localStorage.setItem('user_date_format', data.dateFormat)

      toast.custom((toastId) => (
        <IconNotification
          title={t('settingsSaved')}
          description="Your regional settings have been successfully updated."
          color="success"
          onClose={() => toast.dismiss(toastId)}
        />
      ))

      // Refresh the page to apply new locale
      startTransition(() => {
        window.location.reload()
      })
    } catch (error) {
      console.error('Settings update error:', error)
      toast.custom((toastId) => (
        <IconNotification
          title={tCommon('error')}
          description="Failed to save settings. Please try again."
          color="error"
          onClose={() => toast.dismiss(toastId)}
        />
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language">{t('language')}</Label>
        <Select
          value={currentLanguage}
          onValueChange={(value) => setValue('language', value as 'id' | 'en')}
        >
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(localeConfigs).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.flag} {config.nativeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Choose your preferred language for the application
        </p>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label htmlFor="currency">{t('currency')}</Label>
        <Select
          value={currentCurrency}
          onValueChange={(value) => setValue('currency', value)}
        >
          <SelectTrigger id="currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Choose your preferred currency for displaying prices
        </p>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <Label htmlFor="timezone">{t('timezone')}</Label>
        <Select
          value={currentTimezone}
          onValueChange={(value) => setValue('timezone', value)}
        >
          <SelectTrigger id="timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Choose your timezone for date and time displays
        </p>
      </div>

      {/* Date Format */}
      <div className="space-y-2">
        <Label htmlFor="dateFormat">{t('dateFormat')}</Label>
        <Select
          value={currentDateFormat}
          onValueChange={(value) => setValue('dateFormat', value)}
        >
          <SelectTrigger id="dateFormat">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateFormats.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Choose your preferred date format
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading || isPending}>
          {isLoading || isPending ? tCommon('loading') : tCommon('save')}
        </Button>
      </div>
    </form>
  )
}
