/**
 * Add Inventory Item Page
 *
 * Create new inventory item
 */

import { requireAuth } from '@/lib/auth/guards'
import Link from 'next/link'
import { ROUTES } from '@/utils/constants'
import { InventoryForm } from '@/features/inventory/components/inventory-form'

export default async function NewInventoryPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={ROUTES.INVENTORY}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Inventory
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Add Inventory Item</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a new item to your rental inventory
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5">
        <InventoryForm />
      </div>
    </div>
  )
}
