/**
 * Inventory Detail Component
 *
 * Display and edit inventory item details
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInventoryItem, useDeleteInventoryItem } from '../hooks/use-inventory'
import { InventoryForm } from './inventory-form'
import { formatCurrency } from '@/lib/utils'
import { ROUTES, ITEM_CONDITION_LABELS } from '@/utils/constants'

interface InventoryDetailProps {
  itemId: string
}

export function InventoryDetail({ itemId }: InventoryDetailProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: item, isLoading, error } = useInventoryItem(itemId)
  const deleteMutation = useDeleteInventoryItem()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteMutation.mutateAsync(itemId)
      router.push(ROUTES.INVENTORY)
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete item')
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

  if (error || !item) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">Failed to load item. Please try again.</p>
      </div>
    )
  }

  const pricing = item.pricing as any

  if (isEditing) {
    // Transform item data to match form schema
    const formData = {
      name: item.name,
      description: item.description,
      category_id: item.category_id,
      quantity_total: item.quantity_total,
      condition: item.condition,
      purchase_cost: item.purchase_cost,
      purchase_date: item.purchase_date,
      pricing: item.pricing as any,
      deposit_required: item.deposit_required,
      minimum_rental_period: item.minimum_rental_period,
      photos: item.photos as string[],
      specifications: item.specifications as Record<string, any>,
      status: item.status,
    }

    return (
      <div className="rounded-lg bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Item</h2>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
        <InventoryForm
          initialData={formData}
          itemId={itemId}
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

      {/* Item Details */}
      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
        {/* Photos */}
        {item.photos && item.photos.length > 0 && (
          <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={item.photos[0]}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
              {item.category && (
                <p className="mt-1 text-sm text-gray-500">
                  {item.category.icon} {item.category.name}
                </p>
              )}
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                item.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : item.status === 'rented'
                  ? 'bg-blue-100 text-blue-800'
                  : item.status === 'maintenance'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {item.status}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <p className="mt-4 text-gray-700">{item.description}</p>
          )}

          {/* Key Details */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 sm:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Quantity</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{item.quantity_total}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Condition</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {ITEM_CONDITION_LABELS[item.condition]}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Deposit</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {formatCurrency(item.deposit_required)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Min. Period</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {item.minimum_rental_period}h
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {pricing.hourly && (
                <div>
                  <p className="text-sm text-gray-500">Hourly</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(pricing.hourly)}
                  </p>
                </div>
              )}
              {pricing.daily && (
                <div>
                  <p className="text-sm text-gray-500">Daily</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(pricing.daily)}
                  </p>
                </div>
              )}
              {pricing.weekly && (
                <div>
                  <p className="text-sm text-gray-500">Weekly</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(pricing.weekly)}
                  </p>
                </div>
              )}
              {pricing.monthly && (
                <div>
                  <p className="text-sm text-gray-500">Monthly</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(pricing.monthly)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Purchase Info */}
          {(item.purchase_cost || item.purchase_date) && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Purchase Information</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {item.purchase_cost && (
                  <div>
                    <p className="text-sm text-gray-500">Purchase Cost</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(item.purchase_cost)}
                    </p>
                  </div>
                )}
                {item.purchase_date && (
                  <div>
                    <p className="text-sm text-gray-500">Purchase Date</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {new Date(item.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
