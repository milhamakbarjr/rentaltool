/**
 * Process Return Form Component
 *
 * Form for processing rental returns with condition inspection
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProcessReturn } from '../hooks/use-rentals'
import { processReturnSchema, type ProcessReturnFormData } from '../schemas/rental-schema'
import { ROUTES, ITEM_CONDITION_LABELS } from '@/utils/constants'
import { formatCurrency } from '@/lib/utils'

interface ProcessReturnFormProps {
  rentalId: string
  rental: any
  onCancel: () => void
}

export function ProcessReturnForm({ rentalId, rental, onCancel }: ProcessReturnFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const processReturnMutation = useProcessReturn()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(processReturnSchema),
    defaultValues: {
      return_date: new Date().toISOString().split('T')[0],
      items: rental.rental_items?.map((item: any) => ({
        rental_item_id: item.id,
        condition_after: item.condition_before || 'good',
        notes: '',
      })) || [],
      additional_charges: 0,
      notes: '',
    },
  })

  const onSubmit = async (data: ProcessReturnFormData) => {
    try {
      setError(null)
      await processReturnMutation.mutateAsync({ rentalId, data })
      router.push(ROUTES.RENTALS)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to process return')
      console.error('Form error:', err)
    }
  }

  return (
    <div className="rounded-lg bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Process Return</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Return Date */}
        <div>
          <label htmlFor="return_date" className="block text-sm font-medium text-gray-700">
            Return Date *
          </label>
          <input
            {...register('return_date')}
            type="date"
            id="return_date"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          {errors.return_date && (
            <p className="mt-1 text-sm text-red-600">{errors.return_date.message}</p>
          )}
        </div>

        {/* Item Conditions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Item Conditions</h3>
          <p className="mt-1 text-sm text-gray-600">
            Inspect each item and record its condition after return
          </p>

          <div className="mt-4 space-y-4">
            {rental.rental_items?.map((item: any, index: number) => (
              <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.inventory_item?.name || 'Unknown Item'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} | Before: {ITEM_CONDITION_LABELS[item.condition_before]}
                    </p>
                  </div>
                </div>

                {/* Hidden field for rental_item_id */}
                <input
                  type="hidden"
                  {...register(`items.${index}.rental_item_id`)}
                  value={item.id}
                />

                {/* Condition After */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Condition After Return *
                  </label>
                  <select
                    {...register(`items.${index}.condition_after`)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs_repair">Needs Repair</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes (if any damage or issues)
                  </label>
                  <textarea
                    {...register(`items.${index}.notes`)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Describe any damage or issues..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Charges */}
        <div>
          <label htmlFor="additional_charges" className="block text-sm font-medium text-gray-700">
            Additional Charges (if any)
          </label>
          <input
            {...register('additional_charges', { valueAsNumber: true })}
            type="number"
            id="additional_charges"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="0.00"
          />
          <p className="mt-1 text-sm text-gray-500">
            For late fees, damage charges, or other additional costs
          </p>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            General Notes
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Any additional notes about the return..."
          />
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-purple-50 p-4">
          <h4 className="font-medium text-gray-900">Return Summary</h4>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Original Amount:</span>
              <span className="font-medium">{formatCurrency(rental.total_amount)}</span>
            </div>
            {rental.deposit_amount > 0 && (
              <div className="flex justify-between">
                <span>Deposit:</span>
                <span className="font-medium">{formatCurrency(rental.deposit_amount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                Processing...
              </>
            ) : (
              'Complete Return'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
