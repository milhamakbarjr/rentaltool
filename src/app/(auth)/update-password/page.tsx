/**
 * Update Password Page
 *
 * Set new password after clicking reset link from email
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock01, CheckCircle } from '@untitledui/icons'
import { Button } from '@/components/base/buttons/button'
import { Form } from '@/components/base/form/form'
import { Input } from '@/components/base/input/input'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'
import { BackgroundPattern } from '@/components/shared-assets/background-patterns'
import { updatePassword } from '@/lib/auth/auth'
import { ROUTES } from '@/utils/constants'
import { cx } from '@/utils/cx'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Password validation checks
  const hasMinLength = password.length >= 8
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password requirements
    if (!hasMinLength || !hasSpecialChar) {
      setError('Please meet all password requirements')
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      const { error: updateError } = await updatePassword(password)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Password update error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    router.push(ROUTES.LOGIN)
  }

  // Step 4: Password Reset Success
  if (success) {
    return (
      <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:px-8 md:pt-24">
        <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <FeaturedIcon color="gray" theme="modern" size="xl" className="relative z-10">
                <CheckCircle className="size-7" />
              </FeaturedIcon>
              <BackgroundPattern
                pattern="grid"
                size="lg"
                className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
              />
              <BackgroundPattern
                pattern="grid"
                size="md"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
              />
            </div>

            <div className="z-10 flex flex-col gap-2 md:gap-3">
              <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Password reset</h1>
              <p className="text-md text-tertiary">
                Your password has been successfully reset. Click below to log in magically.
              </p>
            </div>
          </div>

          <Button onClick={handleContinue} size="lg" className="w-full" type="button">
            Continue
          </Button>

          <div className="flex flex-col items-center gap-8 text-center">
            <Button color="link-gray" size="md" href={ROUTES.LOGIN} className="mx-auto" iconLeading={ArrowLeft}>
              Back to log in
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Step 3: Set New Password
  return (
    <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:gap-24 md:px-8 md:pt-24">
      <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <FeaturedIcon color="gray" className="z-10" theme="modern" size="xl">
              <Lock01 className="size-7" />
            </FeaturedIcon>
            <BackgroundPattern
              size="lg"
              pattern="grid"
              className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            />
            <BackgroundPattern
              size="md"
              pattern="grid"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
            />
          </div>

          <div className="z-10 flex flex-col gap-2 md:gap-3">
            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Set new password</h1>
            <p className="text-md text-tertiary">
              Your new password must be different to previously used passwords.
            </p>
          </div>
        </div>

        {error && (
          <div className="z-10 rounded-lg bg-error-secondary p-4">
            <p className="text-sm font-medium text-error-primary">{error}</p>
          </div>
        )}

        <Form onSubmit={handleSubmit} className="z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <Input
              isRequired
              hideRequiredIndicator
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              size="md"
              onChange={setPassword}
              value={password}
            />
            <Input
              isRequired
              hideRequiredIndicator
              label="Confirm password"
              type="password"
              name="password_confirm"
              placeholder="••••••••"
              size="md"
              onChange={setConfirmPassword}
              value={confirmPassword}
            />
            <div className="flex flex-col gap-3">
              <span className="flex gap-2">
                <div
                  className={cx(
                    'flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out',
                    hasMinLength ? 'bg-fg-success-primary' : '',
                  )}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1.25 4L3.75 6.5L8.75 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-sm text-tertiary">Must be at least 8 characters</p>
              </span>
              <span className="flex gap-2">
                <div
                  className={cx(
                    'flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out',
                    hasSpecialChar ? 'bg-fg-success-primary' : '',
                  )}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1.25 4L3.75 6.5L8.75 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-sm text-tertiary">Must contain one special character</p>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" isLoading={isLoading}>
              Reset password
            </Button>
          </div>
        </Form>

        <div className="z-10 flex justify-center gap-1 text-center">
          <Button size="md" color="link-gray" href={ROUTES.LOGIN} className="mx-auto" iconLeading={ArrowLeft}>
            Back to log in
          </Button>
        </div>
      </div>
    </section>
  )
}
