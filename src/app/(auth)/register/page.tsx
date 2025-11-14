/**
 * Register Page
 *
 * New user registration with email, password, and profile info
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/base/buttons/button'
import { SocialButton } from '@/components/base/buttons/social-button'
import { Form } from '@/components/base/form/form'
import { Input } from '@/components/base/input/input'
import { UntitledLogoMinimal } from '@/components/foundations/logo/untitledui-logo-minimal'
import { signUp } from '@/lib/auth/auth'
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth'
import { ROUTES } from '@/utils/constants'

export default function RegisterPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError(null)
      setIsLoading(true)

      const { error: signUpError } = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        businessName: data.businessName,
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // Show success message
      setSuccess(true)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push(ROUTES.DASHBOARD)
        router.refresh()
      }, 1500)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <section className="min-h-screen bg-primary px-4 py-12 sm:bg-secondary md:px-8 md:pt-24 md:pb-[270px]">
        <div className="flex w-full flex-col gap-6 bg-primary sm:mx-auto sm:max-w-110 sm:rounded-2xl sm:px-10 sm:py-8 sm:shadow-sm">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
              <svg
                className="h-6 w-6 text-success-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-display-xs font-semibold text-primary">{tCommon('success')}</h1>
              <p className="text-md text-tertiary">{t('emailSent')}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-primary px-4 py-12 sm:bg-secondary md:px-8 md:pt-24 md:pb-[270px]">
      <div className="flex w-full flex-col gap-6 bg-primary sm:mx-auto sm:max-w-110 sm:rounded-2xl sm:px-10 sm:py-8 sm:shadow-sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <UntitledLogoMinimal className="size-12 max-md:hidden" />
          <UntitledLogoMinimal className="size-10 md:hidden" />
          <div className="flex flex-col gap-2">
            <h1 className="text-display-xs font-semibold text-primary">{t('signUp')}</h1>
            <p className="text-md text-tertiary">{t('signUpSubtitle')}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-error-50 p-4 ring-1 ring-error-200 ring-inset">
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-error-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium text-error-700">{error}</p>
            </div>
          </div>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <Input
              {...register('email')}
              type="email"
              placeholder={t('emailPlaceholder')}
              size="md"
              isRequired
              isInvalid={!!errors.email}
              hint={errors.email?.message}
            />
            <Input
              {...register('fullName')}
              type="text"
              placeholder={t('fullNamePlaceholder')}
              size="md"
              isInvalid={!!errors.fullName}
              hint={errors.fullName?.message}
            />
            <Input
              {...register('businessName')}
              type="text"
              placeholder={t('businessNamePlaceholder')}
              size="md"
              isInvalid={!!errors.businessName}
              hint={errors.businessName?.message}
            />
            <Input
              {...register('password')}
              type="password"
              placeholder={t('passwordPlaceholder')}
              size="md"
              isRequired
              isInvalid={!!errors.password}
              hint={errors.password?.message || t('passwordHint')}
            />
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              size="md"
              isRequired
              isInvalid={!!errors.confirmPassword}
              hint={errors.confirmPassword?.message}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" isDisabled={isLoading}>
              {isLoading ? tCommon('loading') : t('signUpButton')}
            </Button>
            <SocialButton social="google" theme="color">
              {t('signUpWithGoogle')}
            </SocialButton>
          </div>
        </Form>

        <div className="flex justify-center gap-1 text-center">
          <span className="text-sm text-tertiary">{t('alreadyHaveAccount')}</span>
          <Button href={ROUTES.LOGIN} color="link-color" size="md">
            {t('signIn')}
          </Button>
        </div>
      </div>
    </section>
  )
}
