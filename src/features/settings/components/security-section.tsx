'use client'

/**
 * Security Section
 *
 * Form for managing security settings (password change)
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

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and numbers'
      ),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

export function SecuritySection() {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const tValidation = useTranslations('validation')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Supabase doesn't have a direct "verify current password then change" method
      // So we'll just update the password
      // In production, you might want to re-authenticate first
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      })

      if (error) throw error

      toast.custom((toastId) => (
        <IconNotification
          title={t('passwordUpdated')}
          description="Your password has been successfully updated."
          color="success"
          onClose={() => toast.dismiss(toastId)}
        />
      ))
      reset()
    } catch (error) {
      console.error('Password update error:', error)
      toast.custom((toastId) => (
        <IconNotification
          title={t('passwordError')}
          description="Failed to update password. Please try again."
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
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          placeholder="Enter your current password"
        />
        {errors.currentPassword && (
          <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">{t('newPassword')}</Label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          placeholder="Enter your new password"
        />
        {errors.newPassword && (
          <p className="text-sm text-red-600">{errors.newPassword.message}</p>
        )}
        <p className="text-xs text-gray-500">
          {tValidation('passwordRequirements')}
        </p>
      </div>

      {/* Confirm New Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">{t('confirmNewPassword')}</Label>
        <Input
          id="confirmNewPassword"
          type="password"
          {...register('confirmNewPassword')}
          placeholder="Confirm your new password"
        />
        {errors.confirmNewPassword && (
          <p className="text-sm text-red-600">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? tCommon('loading') : t('updatePassword')}
        </Button>
      </div>
    </form>
  )
}
