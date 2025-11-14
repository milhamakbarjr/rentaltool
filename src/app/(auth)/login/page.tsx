/**
 * Login Page
 *
 * User login with email and password
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/base/buttons/button'
import { Form } from '@/components/base/form/form'
import { Input } from '@/components/base/input/input'
import { UntitledLogoMinimal } from '@/components/foundations/logo/untitledui-logo-minimal'
import { signIn } from '@/lib/auth/auth'
import { signInSchema, type SignInFormData } from '@/lib/validations/auth'
import { ROUTES } from '@/utils/constants'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError(null)
      setIsLoading(true)

      const { error: signInError } = await signIn(data)

      if (signInError) {
        setError(signInError.message)
        return
      }

      // Redirect to dashboard on success
      router.push(ROUTES.DASHBOARD)
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-primary px-4 py-12 sm:bg-secondary md:px-8 md:pt-24">
      <div className="flex w-full flex-col gap-6 bg-primary sm:mx-auto sm:max-w-110 sm:rounded-2xl sm:px-10 sm:py-8 sm:shadow-sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <UntitledLogoMinimal className="size-10 md:size-12" />
          <div className="flex flex-col gap-2">
            <h1 className="text-display-xs font-semibold text-primary">Welcome back</h1>
            <p className="text-md text-tertiary">Please enter your details.</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-error-secondary p-4">
            <p className="text-sm font-medium text-error-primary">{error}</p>
          </div>
        )}

        <Form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(onSubmit)(e)
          }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-5">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email"
                  isRequired
                  type="email"
                  placeholder="Enter your email"
                  size="md"
                  isInvalid={!!errors.email}
                  hint={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Password"
                  isRequired
                  type="password"
                  size="md"
                  placeholder="••••••••"
                  isInvalid={!!errors.password}
                  hint={errors.password?.message}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-end">
            <Button color="link-color" size="md" href={ROUTES.RESET_PASSWORD}>
              Forgot password
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" isLoading={isLoading}>
              Sign in
            </Button>
          </div>
        </Form>

        <div className="flex justify-center gap-1 text-center">
          <span className="text-sm text-tertiary">Don&apos;t have an account?</span>
          <Button color="link-color" size="md" href={ROUTES.REGISTER}>
            Sign up
          </Button>
        </div>
      </div>
    </section>
  )
}
