'use client'

/**
 * Profile Section
 *
 * Form for managing user profile information with avatar upload
 */

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User01 } from '@untitledui/icons'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileTrigger } from '@/components/base/file-upload-trigger/file-upload-trigger'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { resetPassword } from '@/lib/auth/auth'
import {
  uploadAvatar,
  validateAvatarFile,
  deleteAvatar,
} from '@/lib/storage/avatar'

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
  const { profile, loading: profileLoading } = useUserProfile()
  const [isLoading, setIsLoading] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      businessName: profile?.business_name || '',
    },
  })

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name || '',
        businessName: profile.business_name || '',
      })
      setAvatarPreview(profile.avatar_url)
    }
  }, [profile, reset])

  const handleAvatarSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const validation = validateAvatarFile(file)

    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    setSelectedFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleResetPassword = async () => {
    try {
      setIsResettingPassword(true)
      const { error } = await resetPassword(userEmail)

      if (error) {
        toast.error('Failed to send reset password email')
        return
      }

      toast.success('Password reset email sent! Please check your inbox.')
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Failed to send reset password email')
    } finally {
      setIsResettingPassword(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      let avatarUrl = profile?.avatar_url

      // Upload new avatar if selected
      if (selectedFile) {
        // Delete old avatar if exists
        if (profile?.avatar_url) {
          await deleteAvatar(profile.avatar_url)
        }

        const uploadResult = await uploadAvatar(userId, selectedFile)

        if (!uploadResult.success) {
          toast.error(uploadResult.error || 'Failed to upload avatar')
          return
        }

        avatarUrl = uploadResult.avatarUrl
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          business_name: data.businessName,
          avatar_url: avatarUrl,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success(t('profileUpdated'))
      setSelectedFile(null)

      // Refresh the page to update the avatar in nav
      window.location.reload()
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(t('profileError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setSelectedFile(null)
    setAvatarPreview(profile?.avatar_url || null)
  }

  const getAvatarDisplay = () => {
    if (avatarPreview) {
      return avatarPreview
    }
    if (profile?.full_name) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}`
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}`
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="space-y-4">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50">
            {avatarPreview || profile?.avatar_url || profile?.full_name ? (
              <img
                src={getAvatarDisplay()}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <User01 className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex flex-col gap-2">
            <FileTrigger
              acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
              onSelect={handleAvatarSelect}
            >
              <Button type="button" variant="secondary">
                {selectedFile ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </FileTrigger>
            <p className="text-xs text-gray-500">
              JPG, PNG or WebP. Max 2MB.
            </p>
          </div>
        </div>
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
        <p className="text-xs text-gray-500">Email cannot be changed</p>
      </div>

      {/* Reset Password Button */}
      <div className="space-y-2">
        <Label>Password</Label>
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleResetPassword}
            disabled={isResettingPassword}
          >
            {isResettingPassword ? 'Sending...' : 'Reset Password'}
          </Button>
          <p className="mt-2 text-xs text-gray-500">
            Click to receive a password reset email
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isLoading || (!isDirty && !selectedFile)}
        >
          {tCommon('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isLoading || profileLoading}
        >
          {isLoading ? tCommon('loading') : tCommon('save')}
        </Button>
      </div>
    </form>
  )
}
