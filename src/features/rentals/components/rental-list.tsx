/**
 * Rental List Component
 *
 * Display list of rentals with search and filters
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRentals } from '../hooks/use-rentals'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { ROUTES, RENTAL_STATUSES, RENTAL_STATUS_LABELS } from '@/utils/constants'
import { formatCurrency } from '@/lib/utils'
import type { RentalFilterData } from '../schemas/rental-schema'

export function RentalList() {
  const [filters, setFilters] = useState<RentalFilterData>({
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const { data: rentals, isLoading, error } = useRentals(filters)
  const { data: customers } = useCustomers()

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
        <p className="text-sm text-red-800">Failed to load rentals. Please try again.</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case RENTAL_STATUSES.ACTIVE:
        return 'bg-green-100 text-green-800'
      case RENTAL_STATUSES.UPCOMING:
        return 'bg-blue-100 text-blue-800'
      case RENTAL_STATUSES.COMPLETED:
        return 'bg-gray-100 text-gray-800'
      case RENTAL_STATUSES.OVERDUE:
        return 'bg-red-100 text-red-800'
      case RENTAL_STATUSES.CANCELLED:
        return 'bg-red-100 text-red-800'
      case RENTAL_STATUSES.DRAFT:
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:flex-row">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by rental number..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Customer Filter */}
        {customers && customers.length > 0 && (
          <div className="sm:w-48">
            <select
              value={filters.customer_id || ''}
              onChange={(e) => setFilters({ ...filters, customer_id: e.target.value })}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">All customers</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="sm:w-48">
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">All statuses</option>
            <option value={RENTAL_STATUSES.DRAFT}>Draft</option>
            <option value={RENTAL_STATUSES.UPCOMING}>Upcoming</option>
            <option value={RENTAL_STATUSES.ACTIVE}>Active</option>
            <option value={RENTAL_STATUSES.OVERDUE}>Overdue</option>
            <option value={RENTAL_STATUSES.COMPLETED}>Completed</option>
            <option value={RENTAL_STATUSES.CANCELLED}>Cancelled</option>
          </select>
        </div>

        {/* Sort */}
        <div className="sm:w-48">
          <select
            value={`${filters.sort_by}-${filters.sort_order}`}
            onChange={(e) => {
              const [sort_by, sort_order] = e.target.value.split('-') as [
                RentalFilterData['sort_by'],
                RentalFilterData['sort_order']
              ]
              setFilters({ ...filters, sort_by, sort_order })
            }}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="created_at-desc">Newest first</option>
            <option value="created_at-asc">Oldest first</option>
            <option value="start_date-desc">Start date (latest)</option>
            <option value="start_date-asc">Start date (earliest)</option>
            <option value="total_amount-desc">Amount (high to low)</option>
            <option value="total_amount-asc">Amount (low to high)</option>
          </select>
        </div>
      </div>

      {/* Rental List */}
      {rentals && rentals.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm ring-1 ring-gray-900/5">
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
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No rentals</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.search || filters.customer_id || filters.status
              ? 'No rentals match your filters'
              : 'Get started by creating your first rental'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentals?.map((rental: any) => (
            <Link
              key={rental.id}
              href={`${ROUTES.RENTALS}/${rental.id}`}
              className="group block rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:ring-gray-900/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Rental Number & Customer */}
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Rental #{rental.rental_number}
                    </h3>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                        rental.status
                      )}`}
                    >
                      {RENTAL_STATUS_LABELS[rental.status] || rental.status}
                    </span>
                  </div>

                  {rental.customer && (
                    <p className="mt-1 text-sm text-gray-600">{rental.customer.name}</p>
                  )}

                  {/* Dates */}
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(rental.start_date).toLocaleDateString()} -{' '}
                        {new Date(rental.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    {rental.rental_items && rental.rental_items.length > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <span>{rental.rental_items.length} item{rental.rental_items.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount & Arrow */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(rental.total_amount)}
                    </p>
                    {rental.deposit_amount > 0 && (
                      <p className="text-sm text-gray-500">
                        Deposit: {formatCurrency(rental.deposit_amount)}
                      </p>
                    )}
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
