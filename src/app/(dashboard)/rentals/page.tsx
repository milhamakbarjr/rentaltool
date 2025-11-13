/**
 * Rentals List Page
 *
 * View and manage all rentals
 */

import { requireAuth } from '@/lib/auth/guards'
import Link from 'next/link'
import { ROUTES } from '@/utils/constants'
import { RentalList } from '@/features/rentals/components/rental-list'

export default async function RentalsPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rentals</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your rental transactions and track returns
          </p>
        </div>
        <Link
          href={`${ROUTES.RENTALS}/new`}
          className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
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
          New Rental
        </Link>
      </div>

      {/* Rental List */}
      <RentalList />
    </div>
  )
}
