/**
 * Inventory Form Component
 *
 * Form for creating/editing inventory items
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateInventoryItem, useUpdateInventoryItem, useCategories } from '../hooks/use-inventory'
import { inventoryItemSchema, type InventoryItemFormData } from '../schemas/inventory-schema'
import { ROUTES } from '@/utils/constants'

interface InventoryFormProps {
  initialData?: InventoryItemFormData
  itemId?: string
  mode?: 'create' | 'edit'
}

export function InventoryForm({ initialData, itemId, mode = 'create' }: InventoryFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { data: categories } = useCategories()
  const createMutation = useCreateInventoryItem()
  const updateMutation = useUpdateInventoryItem()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: initialData || {
      quantity_total: 1,
      condition: 'good',
      deposit_required: 0,
      minimum_rental_period: 24,
      status: 'available',
      pricing: {
        hourly: null,
        daily: null,
        weekly: null,
        monthly: null,
      },
    },
  })

  const onSubmit = async (data: InventoryItemFormData) => {
    try {
      setError(null)

      if (mode === 'edit' && itemId) {
        await updateMutation.mutateAsync({ id: itemId, data })
      } else {
        await createMutation.mutateAsync(data)
      }

      router.push(ROUTES.INVENTORY)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save item')
      console.error('Form error:', err)
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

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Item Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="e.g., Power Drill"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Brief description of the item..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Category & Quantity */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register('category_id')}
              id="category_id"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">No category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity_total" className="block text-sm font-medium text-gray-700">
              Quantity *
            </label>
            <input
              {...register('quantity_total', { valueAsNumber: true })}
              type="number"
              id="quantity_total"
              min="1"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            {errors.quantity_total && <p className="mt-1 text-sm text-red-600">{errors.quantity_total.message}</p>}
          </div>
        </div>

        {/* Condition & Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition *
            </label>
            <select
              {...register('condition')}
              id="condition"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="needs_repair">Needs Repair</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              {...register('status')}
              id="status"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
        <p className="text-sm text-gray-600">At least one rate is required</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pricing.hourly" className="block text-sm font-medium text-gray-700">
              Hourly Rate
            </label>
            <input
              {...register('pricing.hourly', { valueAsNumber: true })}
              type="number"
              id="pricing.hourly"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="pricing.daily" className="block text-sm font-medium text-gray-700">
              Daily Rate
            </label>
            <input
              {...register('pricing.daily', { valueAsNumber: true })}
              type="number"
              id="pricing.daily"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="pricing.weekly" className="block text-sm font-medium text-gray-700">
              Weekly Rate
            </label>
            <input
              {...register('pricing.weekly', { valueAsNumber: true })}
              type="number"
              id="pricing.weekly"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="pricing.monthly" className="block text-sm font-medium text-gray-700">
              Monthly Rate
            </label>
            <input
              {...register('pricing.monthly', { valueAsNumber: true })}
              type="number"
              id="pricing.monthly"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>
        </div>
        {errors.pricing && <p className="mt-1 text-sm text-red-600">{errors.pricing.message}</p>}
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="deposit_required" className="block text-sm font-medium text-gray-700">
              Deposit Required
            </label>
            <input
              {...register('deposit_required', { valueAsNumber: true })}
              type="number"
              id="deposit_required"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="minimum_rental_period" className="block text-sm font-medium text-gray-700">
              Minimum Rental Period (hours)
            </label>
            <input
              {...register('minimum_rental_period', { valueAsNumber: true })}
              type="number"
              id="minimum_rental_period"
              min="1"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="purchase_cost" className="block text-sm font-medium text-gray-700">
              Purchase Cost
            </label>
            <input
              {...register('purchase_cost', { valueAsNumber: true })}
              type="number"
              id="purchase_cost"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <input
              {...register('purchase_date')}
              type="date"
              id="purchase_date"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
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
              Saving...
            </>
          ) : mode === 'edit' ? (
            'Update Item'
          ) : (
            'Create Item'
          )}
        </button>
      </div>
    </form>
  )
}
