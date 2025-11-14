/**
 * Dashboard Stats Component
 *
 * Enhanced dashboard statistics with revenue and trends
 */

'use client'

import Link from 'next/link'
import { useDashboardStats, useTopItems, useRecentRentals } from '../hooks/use-analytics'
import { ROUTES, RENTAL_STATUS_LABELS } from '@/utils/constants'
import { formatCurrency } from '@/lib/utils'

export function DashboardStats() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: topItems, isLoading: topItemsLoading } = useTopItems(5)
  const { data: recentRentals, isLoading: rentalsLoading } = useRecentRentals(5)

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Revenue</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
            {formatCurrency(stats?.total_revenue || 0)}
          </dd>
        </div>

        {/* Active Rentals */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Rentals</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">
            {stats?.active_rentals || 0}
          </dd>
          <div className="mt-2 text-sm text-gray-600">
            {stats?.total_rentals || 0} total
          </div>
        </div>

        {/* Total Customers */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Customers</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-purple-600">
            {stats?.total_customers || 0}
          </dd>
        </div>

        {/* Available Items */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Available Items</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats?.available_items || 0}
          </dd>
          <div className="mt-2 text-sm text-gray-600">
            of {stats?.total_items || 0} total
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Items */}
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Top Rented Items</h3>

          {topItemsLoading ? (
            <div className="mt-4 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
            </div>
          ) : topItems && topItems.length > 0 ? (
            <div className="mt-4 space-y-3">
              {topItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.rental_count} rental{item.rental_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.total_revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No rental data yet</p>
          )}
        </div>

        {/* Recent Rentals */}
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Rentals</h3>
            <Link
              href={ROUTES.RENTALS}
              className="text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              View all
            </Link>
          </div>

          {rentalsLoading ? (
            <div className="mt-4 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
            </div>
          ) : recentRentals && recentRentals.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recentRentals.map((rental: any) => (
                <Link
                  key={rental.id}
                  href={`${ROUTES.RENTALS}/${rental.id}`}
                  className="block border-b border-gray-100 pb-3 transition-colors hover:bg-gray-50 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Rental #{rental.rental_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        {rental.customer?.name || 'Unknown Customer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(rental.total_amount)}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          rental.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : rental.status === 'completed'
                            ? 'bg-gray-100 text-gray-800'
                            : rental.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {RENTAL_STATUS_LABELS[rental.status] || rental.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No recent rentals</p>
          )}
        </div>
      </div>
    </div>
  )
}
