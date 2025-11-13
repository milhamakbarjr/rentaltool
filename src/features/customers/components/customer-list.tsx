/**
 * Customer List Component
 *
 * Display list of customers with search and filters
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCustomers, useCustomerTags } from '../hooks/use-customers'
import { ROUTES } from '@/utils/constants'
import type { CustomerFilterData } from '../schemas/customer-schema'

export function CustomerList() {
  const [filters, setFilters] = useState<CustomerFilterData>({
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const { data: customers, isLoading, error } = useCustomers(filters)
  const { data: tags } = useCustomerTags()

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
        <p className="text-sm text-red-800">Failed to load customers. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:flex-row">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Tag Filter */}
        {tags && tags.length > 0 && (
          <div className="sm:w-48">
            <select
              value={filters.tag || ''}
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">All tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort */}
        <div className="sm:w-48">
          <select
            value={`${filters.sort_by}-${filters.sort_order}`}
            onChange={(e) => {
              const [sort_by, sort_order] = e.target.value.split('-') as [
                CustomerFilterData['sort_by'],
                CustomerFilterData['sort_order']
              ]
              setFilters({ ...filters, sort_by, sort_order })
            }}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="created_at-desc">Newest first</option>
            <option value="created_at-asc">Oldest first</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      {customers && customers.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No customers</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.search || filters.tag
              ? 'No customers match your filters'
              : 'Get started by adding your first customer'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers?.map((customer) => (
            <Link
              key={customer.id}
              href={`${ROUTES.CUSTOMERS}/${customer.id}`}
              className="group rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:ring-gray-900/10"
            >
              {/* Customer Icon */}
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <svg
                    className="h-6 w-6"
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

              {/* Customer Info */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>

                {customer.email && (
                  <p className="mt-1 text-sm text-gray-600">{customer.email}</p>
                )}

                {customer.phone && (
                  <p className="mt-1 text-sm text-gray-600">{customer.phone}</p>
                )}

                {/* Tags */}
                {customer.tags && customer.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(customer.tags as string[]).slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {customer.tags.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        +{customer.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
