'use client'

/**
 * Profile Section
 *
 * Form for managing user profile information
 */

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { IconNotification } from '@/components/application/notifications/notifications'
import { createClient } from '@/lib/supabase/client'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileSectionProps {
  userId: string
  userEmail: string
}

export function ProfileSection({ userId, userEmail }: ProfileSectionProps) {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const tAuth = useTranslations('auth')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          business_name: data.businessName,
        })
        .eq('id', userId)

      if (error) throw error

      toast.custom((toastId) => (
        <IconNotification
          title={t('profileUpdated')}
          description="Your profile has been successfully updated."
          color="success"
          onClose={() => toast.dismiss(toastId)}
        />
      ))
    } catch (error) {
      console.error('Profile update error:', error)
      toast.custom((toastId) => (
        <IconNotification
          title={t('profileError')}
          description="Failed to update profile. Please try again."
          color="error"
          onClose={() => toast.dismiss(toastId)}
        />
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email (read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email">{tAuth('email')}</Label>
        <Input
          id="email"
          type="email"
          value={userEmail}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">
          Email cannot be changed
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">{tAuth('fullName')}</Label>
        <Input
          id="fullName"
          type="text"
          {...register('fullName')}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <Label htmlFor="businessName">{tAuth('businessName')}</Label>
        <Input
          id="businessName"
          type="text"
          {...register('businessName')}
          placeholder="Enter your business name (optional)"
        />
        {errors.businessName && (
          <p className="text-sm text-red-600">{errors.businessName.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? tCommon('loading') : tCommon('save')}
        </Button>
      </div>
    </form>
  )
}
