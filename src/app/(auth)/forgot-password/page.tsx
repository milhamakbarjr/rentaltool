/**
 * Forgot Password Page
 *
 * Request password reset link via email
 */

'use client'

import { useState } from 'react'
import { ArrowLeft, Key01, Mail01 } from '@untitledui/icons'
import { Button } from '@/components/base/buttons/button'
import { Form } from '@/components/base/form/form'
import { Input } from '@/components/base/input/input'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'
import { BackgroundPattern } from '@/components/shared-assets/background-patterns'
import { resetPassword } from '@/lib/auth/auth'
import { ROUTES } from '@/utils/constants'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const emailValue = formData.get('email') as string

    try {
      setError(null)
      setIsLoading(true)

      const { error: resetError } = await resetPassword(emailValue)

      if (resetError) {
        setError(resetError.message)
        return
      }

      setEmail(emailValue)
      setEmailSent(true)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Password reset error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return

    try {
      setError(null)
      setIsLoading(true)

      const { error: resetError } = await resetPassword(email)

      if (resetError) {
        setError(resetError.message)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Password reset error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Check Email
  if (emailSent) {
    return (
      <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:gap-24 md:px-8 md:pt-24">
        <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <FeaturedIcon color="gray" className="z-10" theme="modern" size="xl">
                <Mail01 className="size-7" />
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
              <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Check your email</h1>
              <p className="text-md text-tertiary">
                We sent a password reset link to
                <span className="text-md font-medium"> {email}</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="z-10 rounded-lg bg-error-secondary p-4">
              <p className="text-sm font-medium text-error-primary">{error}</p>
            </div>
          )}

          <div className="flex flex-col items-center gap-8 text-center">
            <p className="flex gap-1">
              <span className="text-sm text-tertiary">Didn&apos;t receive the email?</span>
              <Button color="link-color" size="md" onClick={handleResend} isLoading={isLoading} type="button">
                Click to resend
              </Button>
            </p>
            <Button size="md" color="link-gray" href={ROUTES.LOGIN} className="mx-auto" iconLeading={ArrowLeft}>
              Back to log in
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Step 1: Forgot Password Form
  return (
    <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:px-8 md:pt-24">
      <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <FeaturedIcon color="gray" theme="modern" size="xl" className="z-10">
              <Key01 className="size-7" />
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
            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Forgot password?</h1>
            <p className="self-stretch text-md text-tertiary">No worries, we&apos;ll send you reset instructions.</p>
          </div>
        </div>

        {error && (
          <div className="z-10 rounded-lg bg-error-secondary p-4">
            <p className="text-sm font-medium text-error-primary">{error}</p>
          </div>
        )}

        <Form onSubmit={handleSubmit} className="z-10 flex flex-col gap-6">
          <Input
            isRequired
            hideRequiredIndicator
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            size="md"
          />

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
