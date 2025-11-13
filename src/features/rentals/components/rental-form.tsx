/**
 * Rental Form Component
 *
 * Form for creating/editing rentals with item selection
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateRental, useUpdateRental } from '../hooks/use-rentals'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { useInventoryItems } from '@/features/inventory/hooks/use-inventory'
import { rentalSchema, type RentalFormData } from '../schemas/rental-schema'
import { calculateRentalCost } from '../api'
import { ROUTES, RENTAL_STATUSES } from '@/utils/constants'
import { formatCurrency } from '@/lib/utils'

interface RentalFormProps {
  initialData?: RentalFormData
  rentalId?: string
  mode?: 'create' | 'edit'
}

export function RentalForm({ initialData, rentalId, mode = 'create' }: RentalFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { data: customers } = useCustomers()
  const { data: inventoryItems } = useInventoryItems()
  const createMutation = useCreateRental()
  const updateMutation = useUpdateRental()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(rentalSchema),
    defaultValues: initialData || {
      customer_id: '',
      start_date: '',
      end_date: '',
      status: 'draft',
      total_amount: 0,
      deposit_amount: 0,
      items: [
        {
          inventory_item_id: '',
          quantity: 1,
          rate_type: 'daily',
          rate_amount: 0,
          subtotal: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchItems = watch('items')
  const watchStartDate = watch('start_date')
  const watchEndDate = watch('end_date')

  // Recalculate totals when items, dates, or rates change
  useEffect(() => {
    if (watchStartDate && watchEndDate && watchItems) {
      let newTotal = 0

      watchItems.forEach((item, index) => {
        if (item.rate_amount && item.rate_type) {
          const subtotal = calculateRentalCost(
            item.rate_amount,
            item.rate_type as any,
            watchStartDate,
            watchEndDate
          ) * item.quantity

          setValue(`items.${index}.subtotal`, subtotal)
          newTotal += subtotal
        }
      })

      setValue('total_amount', newTotal)
    }
  }, [watchStartDate, watchEndDate, watchItems, setValue])

  const onSubmit = async (data: RentalFormData) => {
    try {
      setError(null)

      if (mode === 'edit' && rentalId) {
        await updateMutation.mutateAsync({ id: rentalId, data })
      } else {
        await createMutation.mutateAsync(data)
      }

      router.push(ROUTES.RENTALS)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save rental')
      console.error('Form error:', err)
    }
  }

  const handleItemChange = (index: number, itemId: string) => {
    const selectedItem = inventoryItems?.find((item) => item.id === itemId)
    if (selectedItem && selectedItem.pricing) {
      const pricing = selectedItem.pricing as any
      // Set default rate based on available pricing
      if (pricing.daily) {
        setValue(`items.${index}.rate_type`, 'daily')
        setValue(`items.${index}.rate_amount`, pricing.daily)
      } else if (pricing.hourly) {
        setValue(`items.${index}.rate_type`, 'hourly')
        setValue(`items.${index}.rate_amount`, pricing.hourly)
      } else if (pricing.weekly) {
        setValue(`items.${index}.rate_type`, 'weekly')
        setValue(`items.${index}.rate_amount`, pricing.weekly)
      } else if (pricing.monthly) {
        setValue(`items.${index}.rate_type`, 'monthly')
        setValue(`items.${index}.rate_amount`, pricing.monthly)
      }

      setValue(`items.${index}.condition_before`, selectedItem.condition as any)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Customer & Dates */}
      <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="text-lg font-medium text-gray-900">Rental Details</h3>

        {/* Customer */}
        <div>
          <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">
            Customer *
          </label>
          <select
            {...register('customer_id')}
            id="customer_id"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Select a customer</option>
            {customers?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} {customer.email && `(${customer.email})`}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="mt-1 text-sm text-red-600">{errors.customer_id.message}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
              Start Date *
            </label>
            <input
              {...register('start_date')}
              type="date"
              id="start_date"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
              End Date *
            </label>
            <input
              {...register('end_date')}
              type="date"
              id="end_date"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        {/* Status & Deposit */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              {...register('status')}
              id="status"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value={RENTAL_STATUSES.DRAFT}>Draft</option>
              <option value={RENTAL_STATUSES.UPCOMING}>Upcoming</option>
              <option value={RENTAL_STATUSES.ACTIVE}>Active</option>
            </select>
          </div>

          <div>
            <label htmlFor="deposit_amount" className="block text-sm font-medium text-gray-700">
              Deposit Amount
            </label>
            <input
              {...register('deposit_amount', { valueAsNumber: true })}
              type="number"
              id="deposit_amount"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Any additional notes..."
          />
        </div>
      </div>

      {/* Rental Items */}
      <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Rental Items</h3>
          <button
            type="button"
            onClick={() =>
              append({
                inventory_item_id: '',
                quantity: 1,
                rate_type: 'daily',
                rate_amount: 0,
                subtotal: 0,
              })
            }
            className="inline-flex items-center rounded-md border border-purple-600 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Item
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="space-y-4">
              {/* Item Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Item *</label>
                <select
                  {...register(`items.${index}.inventory_item_id`)}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select an item</option>
                  {inventoryItems?.filter((item) => item.status === 'available')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (Qty: {item.quantity_total})
                      </option>
                    ))}
                </select>
                {errors.items?.[index]?.inventory_item_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index]?.inventory_item_id?.message}
                  </p>
                )}
              </div>

              {/* Quantity, Rate Type, Rate Amount */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rate Type</label>
                  <select
                    {...register(`items.${index}.rate_type`)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rate Amount</label>
                  <input
                    {...register(`items.${index}.rate_amount`, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Subtotal & Remove */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-900">
                  Subtotal: {formatCurrency(watchItems[index]?.subtotal || 0)}
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {errors.items && typeof errors.items === 'object' && 'message' in errors.items && (
          <p className="text-sm text-red-600">{errors.items.message as string}</p>
        )}

        {/* Total Amount */}
        <div className="rounded-lg bg-purple-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-purple-600">
              {formatCurrency(watch('total_amount') || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
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
              Saving...
            </>
          ) : mode === 'edit' ? (
            'Update Rental'
          ) : (
            'Create Rental'
          )}
        </button>
      </div>
    </form>
  )
}
