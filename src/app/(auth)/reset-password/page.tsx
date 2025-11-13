/**
 * Reset Password Page
 *
 * Request password reset link via email
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { resetPassword } from '@/lib/auth/auth'
import { resetPasswordRequestSchema, type ResetPasswordRequestFormData } from '@/lib/validations/auth'
import { ROUTES } from '@/utils/constants'

export default function ResetPasswordPage() {
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestFormData>({
    resolver: zodResolver(resetPasswordRequestSchema),
  })

  const onSubmit = async (data: ResetPasswordRequestFormData) => {
    try {
      setError(null)
      setIsLoading(true)

      const { error: resetError } = await resetPassword(data.email)

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Password reset error:', err)
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{t('emailSent')}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {t('resetPasswordSuccess')}
        </p>
        <div className="mt-6">
          <Link
            href={ROUTES.LOGIN}
            className="text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('resetPassword')}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('resetPasswordDescription')}
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

      {/* Reset Form */}
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
              t('resetPasswordButton')
            )}
          </button>
        </div>
      </form>

      {/* Back to Sign In Link */}
      <div className="text-center">
        <Link
          href={ROUTES.LOGIN}
          className="text-sm font-medium text-purple-600 hover:text-purple-500"
        >
          {t('backToLogin')}
        </Link>
      </div>
    </div>
  )
}
