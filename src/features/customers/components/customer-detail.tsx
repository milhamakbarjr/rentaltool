/**
 * Customer Detail Component
 *
 * Display and edit customer details with rental history
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCustomer, useDeleteCustomer } from '../hooks/use-customers'
import { CustomerForm } from './customer-form'
import { ROUTES } from '@/utils/constants'
import { formatCurrency } from '@/lib/utils'

interface CustomerDetailProps {
  customerId: string
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: customer, isLoading, error } = useCustomer(customerId)
  const deleteMutation = useDeleteCustomer()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteMutation.mutateAsync(customerId)
      router.push(ROUTES.CUSTOMERS)
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete customer')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">Failed to load customer. Please try again.</p>
      </div>
    )
  }

  if (isEditing) {
    // Transform customer data to match form schema
    const formData = {
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      notes: customer.notes || '',
      tags: customer.tags || [],
    }

    return (
      <div className="rounded-lg bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Customer</h2>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
        <CustomerForm
          initialData={formData}
          customerId={customerId}
          mode="edit"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
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
              Deleting...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </>
          )}
        </button>
      </div>

      {/* Customer Details */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
        <div className="p-6">
          {/* Header with Icon */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>

              {/* Contact Info */}
              <div className="mt-3 space-y-2">
                {customer.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm">{customer.email}</span>
                  </div>
                )}

                {customer.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                )}

                {customer.address && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg className="mt-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm">{customer.address}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {customer.tags && customer.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(customer.tags as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Notes</h3>
              <p className="mt-2 whitespace-pre-wrap text-gray-700">{customer.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Rental History */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Rental History</h3>

          {customer.rentals && customer.rentals.length > 0 ? (
            <div className="mt-4 space-y-3">
              {customer.rentals.map((rental: any) => (
                <Link
                  key={rental.id}
                  href={`${ROUTES.RENTALS}/${rental.id}`}
                  className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-500 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Rental #{rental.rental_number}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {new Date(rental.start_date).toLocaleDateString()} -{' '}
                        {new Date(rental.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(rental.total_amount)}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          rental.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : rental.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : rental.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {rental.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="mt-2 text-sm font-semibold text-gray-900">No rental history</h4>
              <p className="mt-1 text-sm text-gray-500">
                This customer hasn&apos;t made any rentals yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
