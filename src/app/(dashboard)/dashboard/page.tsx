/**
 * Dashboard Page
 *
 * Main dashboard overview with stats and quick actions
 */

import { requireAuth, getUserProfile } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ROUTES } from '@/utils/constants'

export default async function DashboardPage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)
  const supabase = await createClient()

  // Fetch basic stats
  const [
    { count: rentalsCount },
    { count: customersCount },
    { count: inventoryCount },
  ] = await Promise.all([
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('inventory_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.full_name || 'there'}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with your rental business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Rentals */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Rentals</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {rentalsCount || 0}
          </dd>
        </div>

        {/* Total Customers */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Customers</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {customersCount || 0}
          </dd>
        </div>

        {/* Inventory Items */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Inventory Items</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {inventoryCount || 0}
          </dd>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={ROUTES.RENTALS}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg
              className="mr-2 h-5 w-5 text-gray-400"
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
            Create Rental
          </Link>

          <Link
            href={ROUTES.CUSTOMERS}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg
              className="mr-2 h-5 w-5 text-gray-400"
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
            Add Customer
          </Link>

          <Link
            href={ROUTES.INVENTORY}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg
              className="mr-2 h-5 w-5 text-gray-400"
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
            Add Inventory
          </Link>

          <Link
            href={ROUTES.ANALYTICS}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg
              className="mr-2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            View Analytics
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      {rentalsCount === 0 && customersCount === 0 && inventoryCount === 0 && (
        <div className="rounded-lg bg-purple-50 px-4 py-5 shadow sm:p-6">
          <h3 className="text-lg font-medium text-purple-900">Getting Started</h3>
          <div className="mt-2 text-sm text-purple-700">
            <p>Welcome to RentalTool! Here's how to get started:</p>
            <ol className="mt-3 list-decimal list-inside space-y-2">
              <li>Add your inventory items (equipment, tools, vehicles, etc.)</li>
              <li>Create customer profiles for your clients</li>
              <li>Start creating rentals and tracking your business</li>
            </ol>
          </div>
          <div className="mt-4">
            <Link
              href={ROUTES.INVENTORY}
              className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
            >
              Add your first inventory item
              <svg
                className="ml-2 h-4 w-4"
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
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
