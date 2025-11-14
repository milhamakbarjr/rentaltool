/**
 * Rental Detail Component
 *
 * Display rental details with process return functionality
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRental, useDeleteRental } from '../hooks/use-rentals'
import { RentalForm } from './rental-form'
import { ProcessReturnForm } from './process-return-form'
import { ROUTES, RENTAL_STATUS_LABELS, ITEM_CONDITION_LABELS } from '@/utils/constants'
import { formatCurrency } from '@/lib/utils'

interface RentalDetailProps {
  rentalId: string
}

export function RentalDetail({ rentalId }: RentalDetailProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isProcessingReturn, setIsProcessingReturn] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: rental, isLoading, error } = useRental(rentalId)
  const deleteMutation = useDeleteRental()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this rental? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteMutation.mutateAsync(rentalId)
      router.push(ROUTES.RENTALS)
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete rental')
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

  if (error || !rental) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">Failed to load rental. Please try again.</p>
      </div>
    )
  }

  if (isEditing) {
    const formData = {
      customer_id: rental.customer_id,
      start_date: rental.start_date,
      end_date: rental.end_date,
      return_date: rental.return_date || '',
      status: rental.status,
      total_amount: rental.total_amount,
      deposit_amount: rental.deposit_amount,
      notes: rental.notes || '',
      items: rental.rental_items?.map((item: any) => ({
        inventory_item_id: item.inventory_item_id,
        quantity: item.quantity,
        rate_type: item.rate_type,
        rate_amount: item.rate_amount,
        subtotal: item.subtotal,
        condition_before: item.condition_before,
        condition_after: item.condition_after,
        notes: item.notes || '',
      })) || [],
    }

    return (
      <div className="rounded-lg bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Rental</h2>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
        <RentalForm initialData={formData} rentalId={rentalId} mode="edit" />
      </div>
    )
  }

  if (isProcessingReturn) {
    return <ProcessReturnForm rentalId={rentalId} rental={rental} onCancel={() => setIsProcessingReturn(false)} />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const canProcessReturn = rental.status === 'active' || rental.status === 'overdue'

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-end space-x-3">
        {canProcessReturn && (
          <button
            onClick={() => setIsProcessingReturn(true)}
            className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Process Return
          </button>
        )}
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {/* Rental Details */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Rental #{rental.rental_number}
              </h1>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                  rental.status
                )}`}
              >
                {RENTAL_STATUS_LABELS[rental.status] || rental.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(rental.total_amount)}
              </p>
              {rental.deposit_amount > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  Deposit: {formatCurrency(rental.deposit_amount)}
                </p>
              )}
            </div>
          </div>

          {/* Customer Info */}
          {rental.customer && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Customer</h3>
              <div className="mt-2">
                <p className="font-medium text-gray-900">{rental.customer.name}</p>
                {rental.customer.email && (
                  <p className="text-sm text-gray-600">{rental.customer.email}</p>
                )}
                {rental.customer.phone && (
                  <p className="text-sm text-gray-600">{rental.customer.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Rental Period</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="mt-1 font-medium text-gray-900">
                  {new Date(rental.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="mt-1 font-medium text-gray-900">
                  {new Date(rental.end_date).toLocaleDateString()}
                </p>
              </div>
              {rental.return_date && (
                <div>
                  <p className="text-sm text-gray-500">Return Date</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {new Date(rental.return_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rental Items */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Items</h3>
            <div className="mt-4 space-y-3">
              {rental.rental_items?.map((item: any) => (
                <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.inventory_item?.name || 'Unknown Item'}
                      </p>
                      <div className="mt-1 flex gap-4 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>Rate: {formatCurrency(item.rate_amount)} / {item.rate_type}</span>
                        {item.condition_before && (
                          <span>Condition: {ITEM_CONDITION_LABELS[item.condition_before]}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {rental.notes && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Notes</h3>
              <p className="mt-2 whitespace-pre-wrap text-gray-700">{rental.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payments */}
      {rental.payments && rental.payments.length > 0 && (
        <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Payments</h3>
            <div className="mt-4 space-y-3">
              {rental.payments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {payment.payment_method} - {new Date(payment.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
