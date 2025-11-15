/**
 * Customer List Component
 *
 * Display list of customers with search and filters using Untitled UI
 */

'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchLg, Mail01, Phone } from '@untitledui/icons'
import type { SortDescriptor } from 'react-aria-components'
import { Table, TableCard } from '@/components/application/table/table'
import { EmptyState } from '@/components/application/empty-state/empty-state'
import { PaginationCardMinimal } from '@/components/application/pagination/pagination'
import { Avatar } from '@/components/base/avatar/avatar'
import { BadgeWithDot } from '@/components/base/badges/badges'
import { Input } from '@/components/base/input/input'
import { Select } from '@/components/base/select/select'
import { useCustomers, useCustomerTags } from '../hooks/use-customers'
import { ROUTES } from '@/utils/constants'
import type { CustomerFilterData } from '../schemas/customer-schema'
import { useTranslations } from 'next-intl'

// Helper to get initials from name
const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`
  }
  return name.substring(0, 2).toUpperCase()
}

export function CustomerList() {
  const t = useTranslations('customers')
  const router = useRouter()
  const [filters, setFilters] = useState<CustomerFilterData>({
    sort_by: 'created_at',
    sort_order: 'desc',
  })
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'created_at',
    direction: 'descending',
  })

  const { data: customers, isLoading, error } = useCustomers(filters)
  const { data: tags } = useCustomerTags()

  // Sort customers based on sortDescriptor
  const sortedCustomers = useMemo(() => {
    if (!customers) return []
    if (!sortDescriptor) return customers

    return [...customers].sort((a, b) => {
      const column = sortDescriptor.column as keyof typeof a
      let first = a[column]
      let second = b[column]

      // Handle numbers
      if (typeof first === 'number' && typeof second === 'number') {
        return sortDescriptor.direction === 'ascending' ? first - second : second - first
      }

      // Handle strings
      if (typeof first === 'string' && typeof second === 'string') {
        const result = first.localeCompare(second)
        return sortDescriptor.direction === 'ascending' ? result : -result
      }

      // Handle dates
      if (first instanceof Date && second instanceof Date) {
        return sortDescriptor.direction === 'ascending'
          ? first.getTime() - second.getTime()
          : second.getTime() - first.getTime()
      }

      return 0
    })
  }, [customers, sortDescriptor])

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor)
    setFilters({
      ...filters,
      sort_by: descriptor.column as CustomerFilterData['sort_by'],
      sort_order: descriptor.direction === 'ascending' ? 'asc' : 'desc',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-utility-brand-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-utility-error-50 p-4">
        <p className="text-sm text-utility-error-700">{t('errorLoading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          className="flex-1"
          size="md"
          icon={SearchLg}
          placeholder={t('searchPlaceholder')}
          value={filters.search || ''}
          onChange={(value) => setFilters({ ...filters, search: value })}
        />

        {/* Tag Filter */}
        {tags && tags.length > 0 && (
          <Select
            className="sm:w-48"
            placeholder={t('allTags')}
            selectedKey={filters.tag || ''}
            onSelectionChange={(key) => setFilters({ ...filters, tag: key as string })}
          >
            <Select.Item id="" textValue={t('allTags')}>
              {t('allTags')}
            </Select.Item>
            {tags.map((tag) => (
              <Select.Item id={tag} key={tag} textValue={tag}>
                {tag}
              </Select.Item>
            ))}
          </Select>
        )}
      </div>

      {/* Customer Table */}
      {sortedCustomers && sortedCustomers.length === 0 ? (
        <EmptyState size="lg">
          <EmptyState.Header>
            <EmptyState.FeaturedIcon icon={SearchLg} color="gray" theme="modern" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>
              {filters.search || filters.tag ? t('noCustomersFound') : t('noCustomers')}
            </EmptyState.Title>
            <EmptyState.Description>
              {filters.search || filters.tag
                ? t('tryAdjustingFilters')
                : t('noCustomersDescription')}
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState>
      ) : (
        <TableCard.Root className="bg-secondary_subtle shadow-xs lg:rounded-xl">
          <div className="flex gap-4 px-5 pt-3 pb-2.5">
            <p className="text-sm font-semibold text-primary">{t('allCustomers')}</p>
            <BadgeWithDot color="gray" type="modern" size="sm">
              {sortedCustomers?.length || 0} {t('total')}
            </BadgeWithDot>
          </div>

          <Table
            aria-label={t('title')}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange}
            onRowAction={(key) => router.push(`${ROUTES.CUSTOMERS}/${key}`)}
            className="bg-primary"
          >
            <Table.Header className="bg-primary">
              <Table.Head id="name" label={t('customer')} allowsSorting isRowHeader className="w-full" />
              <Table.Head id="email" label={t('contact')} allowsSorting className="max-md:hidden" />
              <Table.Head id="phone" label={t('phone')} className="max-lg:hidden" />
              <Table.Head id="tags" label={t('tags')} className="max-lg:hidden" />
              <Table.Head id="created_at" label={t('added')} allowsSorting className="max-md:hidden" />
            </Table.Header>

            <Table.Body items={sortedCustomers || []}>
              {(customer) => (
                <Table.Row id={customer.id} className="cursor-pointer hover:bg-secondary_subtle">
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials={getInitials(customer.name)}
                        alt={customer.name}
                        size="md"
                      />
                      <div>
                        <p className="text-sm font-medium text-primary">{customer.name}</p>
                        <p className="text-sm text-tertiary md:hidden">
                          {customer.email || customer.phone || t('noContact')}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="max-md:hidden">
                    <div className="flex flex-col gap-1">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm text-secondary">
                          <Mail01 className="h-4 w-4 text-tertiary" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      {!customer.email && customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-secondary">
                          <Phone className="h-4 w-4 text-tertiary" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      {!customer.email && !customer.phone && (
                        <span className="text-sm text-tertiary">{t('noContact')}</span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="max-lg:hidden">
                    {customer.phone ? (
                      <span className="text-sm text-secondary">{customer.phone}</span>
                    ) : (
                      <span className="text-sm text-tertiary">—</span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="max-lg:hidden">
                    {customer.tags && (customer.tags as string[]).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {(customer.tags as string[]).slice(0, 2).map((tag: string) => (
                          <BadgeWithDot key={tag} color="gray" type="modern" size="sm">
                            {tag}
                          </BadgeWithDot>
                        ))}
                        {(customer.tags as string[]).length > 2 && (
                          <BadgeWithDot color="gray" type="modern" size="sm">
                            +{(customer.tags as string[]).length - 2}
                          </BadgeWithDot>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-tertiary">—</span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="max-md:hidden">
                    <span className="text-sm text-secondary">
                      {new Date(customer.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>

          <PaginationCardMinimal align="right" page={1} total={1} className="bg-primary" />
        </TableCard.Root>
      )}
    </div>
  )
}
