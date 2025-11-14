/**
 * Update Password Page
 *
 * Set new password after clicking reset link from email
 */

'use client'

import { useState } from 'react'
import { ArrowLeft, Lock01, CheckCircle } from '@untitledui/icons'
import { Button } from '@/components/base/buttons/button'
import { Form } from '@/components/base/form/form'
import { Input } from '@/components/base/input/input'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'
import { CheckmarkIcon } from '@/components/foundations/icons/checkmark-icon'
import { BackgroundPattern } from '@/components/shared-assets/background-patterns'
import { updatePassword } from '@/lib/auth/auth'
import { ROUTES } from '@/utils/constants'
import { cx } from '@/utils/cx'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Password validation checks matching resetPasswordSchema
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password requirements
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber) {
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

          <Button href={ROUTES.LOGIN} size="lg" className="w-full">
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
    <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:px-8 md:pt-24">
      <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <FeaturedIcon color="gray" theme="modern" size="xl" className="z-10">
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
            <div className="flex flex-col gap-3" role="status" aria-live="polite">
              <span className="flex gap-2">
                <div
                  className={cx(
                    'flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out',
                    hasMinLength ? 'bg-fg-success-primary' : '',
                  )}
                  aria-label={hasMinLength ? 'Requirement met: at least 8 characters' : 'Requirement not met: at least 8 characters'}
                >
                  <CheckmarkIcon />
                </div>
                <p className="text-sm text-tertiary">Must be at least 8 characters</p>
              </span>
              <span className="flex gap-2">
                <div
                  className={cx(
                    'flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out',
                    hasUppercase ? 'bg-fg-success-primary' : '',
                  )}
                  aria-label={hasUppercase ? 'Requirement met: one uppercase letter' : 'Requirement not met: one uppercase letter'}
                >
                  <CheckmarkIcon />
                </div>
                <p className="text-sm text-tertiary">Must contain one uppercase letter</p>
              </span>
              <span className="flex gap-2">
                <div
                  className={cx(
                    'flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out',
                    hasLowercase ? 'bg-fg-success-primary' : '',
                  )}
                  aria-label={hasLowercase ? 'Requirement met: one lowercase letter' : 'Requirement not met: one lowercase letter'}
                >
                  <CheckmarkIcon />
                </div>
                <p className="text-sm text-tertiary">Must contain one lowercase letter</p>
              </span>
              <span className="flex gap-2">
                <div
                  className={cx(
                    'flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out',
                    hasNumber ? 'bg-fg-success-primary' : '',
                  )}
                  aria-label={hasNumber ? 'Requirement met: one number' : 'Requirement not met: one number'}
                >
                  <CheckmarkIcon />
                </div>
                <p className="text-sm text-tertiary">Must contain one number</p>
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
