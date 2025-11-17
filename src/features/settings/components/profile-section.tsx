'use client'

/**
 * Profile Section
 *
 * Form for managing user profile information with avatar upload
 * Using Untitled UI layout components for consistent design
 */

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SectionHeader } from '@/components/application/section-headers/section-headers'
import { SectionLabel } from '@/components/application/section-headers/section-label'
import { SectionFooter } from '@/components/application/section-footers/section-footer'
import { FileUploadDropZone } from '@/components/application/file-upload/file-upload-base'
import { Avatar } from '@/components/base/avatar/avatar'
import { Button } from '@/components/base/buttons/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useUserProfile } from '@/hooks/use-user-profile'
import { resetPassword } from '@/lib/auth/auth'
import {
  uploadAvatar,
  validateAvatarFile,
  deleteAvatar,
  getAvatarSignedUrl,
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
  const { profile, loading: profileLoading, updateProfile } = useUserProfile()
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

  // Update form when profile loads and generate signed URL for avatar
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name || '',
        businessName: profile.business_name || '',
      })

      // Generate signed URL if avatar exists
      if (profile.avatar_url) {
        getAvatarSignedUrl(profile.avatar_url).then((signedUrl) => {
          if (signedUrl) {
            setAvatarPreview(signedUrl)
          }
        })
      } else {
        setAvatarPreview(null)
      }
    }
  }, [profile, reset])

  const handleAvatarDrop = (files: FileList) => {
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

      let avatarPath = profile?.avatar_url

      // Upload new avatar if selected
      if (selectedFile) {
        // Delete old avatar if exists
        if (profile?.avatar_url) {
          await deleteAvatar(profile.avatar_url)
        }

        const uploadResult = await uploadAvatar(userId, selectedFile)

        if (!uploadResult.success) {
          toast.error(uploadResult.error || 'Failed to upload avatar')
          setIsLoading(false)
          return
        }

        avatarPath = uploadResult.filePath
      }

      // Update profile using the hook's updateProfile function
      console.log('Submitting profile update for userId:', userId)
      const result = await updateProfile({
        full_name: data.fullName,
        business_name: data.businessName,
        avatar_url: avatarPath,
      })

      if (result?.error) {
        console.error('Update failed with error:', result.error)
        const errorMessage = result.error.message || 'Failed to update profile'
        toast.error(errorMessage)
        setIsLoading(false)
        return
      }

      console.log('Profile updated successfully:', result.data)

      // Update form with new values
      reset({
        fullName: data.fullName,
        businessName: data.businessName,
      })

      // Clear selected file and update avatar preview
      setSelectedFile(null)
      if (avatarPath) {
        const signedUrl = await getAvatarSignedUrl(avatarPath)
        setAvatarPreview(signedUrl)
      }

      toast.success(t('profileUpdated'))

      // Small delay to ensure UI updates, then reload to update nav
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`${t('profileError')}: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    reset()
    setSelectedFile(null)

    // Regenerate signed URL when canceling
    if (profile?.avatar_url) {
      const signedUrl = await getAvatarSignedUrl(profile.avatar_url)
      setAvatarPreview(signedUrl)
    } else {
      setAvatarPreview(null)
    }
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <SectionHeader.Root>
        <SectionHeader.Group>
          <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
            <SectionHeader.Heading>Personal info</SectionHeader.Heading>
            <SectionHeader.Subheading>
              Update your photo and personal details here.
            </SectionHeader.Subheading>
          </div>
        </SectionHeader.Group>
      </SectionHeader.Root>

      {/* Form content */}
      <div className="flex flex-col gap-5">
        {/* Full Name */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
          <SectionLabel.Root
            isRequired
            size="sm"
            title="Full name"
            className="max-lg:hidden"
          />

          <div className="flex flex-col gap-1.5">
            <Label className="lg:hidden">Full name</Label>
            <Input
              placeholder="Enter your full name"
              required
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>
        </div>

        <hr className="h-px w-full border-none bg-border-secondary" />

        {/* Business Name */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
          <SectionLabel.Root
            size="sm"
            title="Business name"
            description="Optional business or company name"
            className="max-lg:hidden"
          />

          <div className="flex flex-col gap-1.5">
            <Label className="lg:hidden">Business name (optional)</Label>
            <Input
              placeholder="Enter your business name"
              {...register('businessName')}
            />
            {errors.businessName && (
              <p className="text-sm text-red-600">{errors.businessName.message}</p>
            )}
          </div>
        </div>

        <hr className="h-px w-full border-none bg-border-secondary" />

        {/* Email (read-only) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
          <SectionLabel.Root
            size="sm"
            title="Email address"
            description="Your account email cannot be changed"
            className="max-lg:hidden"
          />

          <div className="flex flex-col gap-1.5">
            <Label className="lg:hidden">Email address</Label>
            <Input value={userEmail} disabled className="bg-gray-50" />
            <p className="text-sm text-gray-500">Email cannot be changed</p>
          </div>
        </div>

        <hr className="h-px w-full border-none bg-border-secondary" />

        {/* Avatar Upload */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
          <SectionLabel.Root
            size="sm"
            title="Your photo"
            description="This will be displayed on your profile."
          />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <Avatar size="2xl" src={getAvatarDisplay()} />

            <FileUploadDropZone
              className="w-full"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              allowsMultiple={false}
              maxSize={2 * 1024 * 1024}
              hint="JPG, PNG or WebP (max. 2MB)"
              onDropFiles={handleAvatarDrop}
              onSizeLimitExceed={() => toast.error('File size too large. Maximum size is 2MB.')}
              onDropUnacceptedFiles={() =>
                toast.error('Invalid file type. Please upload a JPG, PNG, or WebP image.')
              }
            />
          </div>
        </div>

        <hr className="h-px w-full border-none bg-border-secondary" />

        {/* Password Reset */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
          <SectionLabel.Root
            size="sm"
            title="Password"
            description="Reset your account password"
          />

          <div className="flex flex-col gap-2">
            <Button
              color="secondary"
              size="md"
              type="button"
              onClick={handleResetPassword}
              disabled={isResettingPassword}
            >
              {isResettingPassword ? 'Sending...' : 'Reset Password'}
            </Button>
            <p className="text-sm text-tertiary">
              Click to receive a password reset email
            </p>
          </div>
        </div>
      </div>

      <SectionFooter.Root>
        <SectionFooter.Actions>
          <Button
            color="secondary"
            size="md"
            type="button"
            onClick={handleCancel}
            disabled={isLoading || (!isDirty && !selectedFile)}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            color="primary"
            size="md"
            type="submit"
            disabled={isLoading || profileLoading}
          >
            {isLoading ? tCommon('loading') : tCommon('save')}
          </Button>
        </SectionFooter.Actions>
      </SectionFooter.Root>
    </form>
  )
}
