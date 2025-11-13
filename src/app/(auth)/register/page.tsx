/**
 * Register Page
 *
 * New user registration with email, password, and profile info
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
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
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
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
        <h3 className="mt-4 text-lg font-medium text-gray-900">{tCommon('success')}</h3>
        <p className="mt-2 text-sm text-gray-600">{t('emailSent')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('signUp')}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('alreadyHaveAccount')}{' '}
          <Link href={ROUTES.LOGIN} className="font-medium text-purple-600 hover:text-purple-500">
            {t('signIn')}
          </Link>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
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
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t('email')}
          </label>
          <div className="mt-1">
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Full Name Field */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            {t('fullName')}
          </label>
          <div className="mt-1">
            <input
              {...register('fullName')}
              id="fullName"
              type="text"
              autoComplete="name"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>
        </div>

        {/* Business Name Field */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            {t('businessName')}
          </label>
          <div className="mt-1">
            <input
              {...register('businessName')}
              id="businessName"
              type="text"
              autoComplete="organization"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
              placeholder="My Rental Business"
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t('password')}
          </label>
          <div className="mt-1">
            <input
              {...register('password')}
              id="password"
              type="password"
              autoComplete="new-password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            {t('confirmPassword')}
          </label>
          <div className="mt-1">
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {tCommon('loading')}
              </span>
            ) : (
              t('signUpButton')
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
