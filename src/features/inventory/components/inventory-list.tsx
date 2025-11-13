/**
 * Inventory List Component
 *
 * Displays list of inventory items with search and filters
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useInventoryItems, useCategories } from '../hooks/use-inventory'
import { formatCurrency } from '@/lib/utils'
import { ROUTES, ITEM_CONDITION_LABELS } from '@/utils/constants'
import type { InventoryFilterData } from '../schemas/inventory-schema'

export function InventoryList() {
  const [filters, setFilters] = useState<InventoryFilterData>({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const { data: items, isLoading, error } = useInventoryItems(filters)
  const { data: categories } = useCategories()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">Failed to load inventory. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search inventory..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.category_id || ''}
          onChange={(e) => setFilters({ ...filters, category_id: e.target.value || undefined })}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      {/* Items Grid */}
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const pricing = item.pricing as any
            const dailyRate = pricing?.daily

            return (
              <Link
                key={item.id}
                href={`${ROUTES.INVENTORY}/${item.id}`}
                className="block rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5 transition hover:shadow-md"
              >
                {/* Photo */}
                {item.photos && item.photos.length > 0 ? (
                  <div className="aspect-video overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center rounded-md bg-gray-100">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="mt-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.category && (
                        <p className="mt-1 text-xs text-gray-500">
                          {item.category.icon} {item.category.name}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
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

                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      {dailyRate && (
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(dailyRate)}
                          <span className="text-sm font-normal text-gray-500">/day</span>
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity_total}
                    </p>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    {ITEM_CONDITION_LABELS[item.condition]}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 px-4 py-12 text-center">
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-gray-900">No inventory items</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by adding your first inventory item.
          </p>
          <Link
            href={`${ROUTES.INVENTORY}/new`}
            className="mt-4 inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Item
          </Link>
        </div>
      )}
    </div>
  )
}
