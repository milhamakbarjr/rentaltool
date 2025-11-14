/**
 * Customer Detail Component
 *
 * Display and edit customer details with rental history using Untitled UI
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail01, Phone, MarkerPin01, Edit05, Trash01, File01 } from '@untitledui/icons'
import { useCustomer, useDeleteCustomer } from '../hooks/use-customers'
import { CustomerForm } from './customer-form'
import { ROUTES } from '@/utils/constants'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/base/buttons/button'
import { Avatar } from '@/components/base/avatar/avatar'
import { BadgeWithDot } from '@/components/base/badges/badges'
import { EmptyState } from '@/components/application/empty-state/empty-state'
import { Tag, TagGroup, TagList } from '@/components/base/tags/tags'

interface CustomerDetailProps {
  customerId: string
}

// Helper to get initials from name
const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`
  }
  return name.substring(0, 2).toUpperCase()
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: customer, isLoading, error } = useCustomer(customerId)
  const deleteMutation = useDeleteCustomer()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteMutation.mutateAsync(customerId)
      router.push(ROUTES.CUSTOMERS)
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete customer')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-utility-brand-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="rounded-lg bg-utility-error-50 p-4 ring-1 ring-utility-error-200">
        <p className="text-sm text-utility-error-700">Failed to load customer. Please try again.</p>
      </div>
    )
  }

  if (isEditing) {
    // Transform customer data to match form schema
    const formData = {
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      notes: customer.notes || '',
      tags: customer.tags || [],
    }

    return (
      <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">Edit Customer</h2>
          <Button
            color="tertiary"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
        <CustomerForm
          initialData={formData}
          customerId={customerId}
          mode="edit"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          color="secondary"
          size="md"
          iconLeading={Edit05}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
        <Button
          color="secondary-destructive"
          size="md"
          iconLeading={Trash01}
          onClick={handleDelete}
          isDisabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      {/* Customer Details Card */}
      <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset">
        <div className="p-6 lg:p-8">
          {/* Header with Avatar */}
          <div className="flex items-start gap-4">
            <Avatar
              initials={getInitials(customer.name)}
              alt={customer.name}
              size="2xl"
            />

            <div className="flex-1">
              <h1 className="text-display-xs font-semibold text-primary">{customer.name}</h1>

              {/* Contact Info */}
              <div className="mt-4 space-y-3">
                {customer.email && (
                  <div className="flex items-center gap-2 text-secondary">
                    <Mail01 className="h-5 w-5 text-tertiary" />
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-md hover:text-primary hover:underline"
                    >
                      {customer.email}
                    </a>
                  </div>
                )}

                {customer.phone && (
                  <div className="flex items-center gap-2 text-secondary">
                    <Phone className="h-5 w-5 text-tertiary" />
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-md hover:text-primary hover:underline"
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}

                {customer.address && (
                  <div className="flex items-start gap-2 text-secondary">
                    <MarkerPin01 className="mt-0.5 h-5 w-5 text-tertiary" />
                    <span className="text-md">{customer.address}</span>
                  </div>
                )}

                {!customer.email && !customer.phone && !customer.address && (
                  <p className="text-sm text-tertiary">No contact information available</p>
                )}
              </div>

              {/* Tags */}
              {customer.tags && (customer.tags as string[]).length > 0 && (
                <div className="mt-4">
                  <TagGroup label="Customer tags" selectionMode="none">
                    <TagList
                      items={(customer.tags as string[]).map(tag => ({ id: tag, label: tag }))}
                      className="flex flex-wrap gap-2"
                    >
                      {(item) => <Tag id={item.id}>{item.label}</Tag>}
                    </TagList>
                  </TagGroup>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="mt-6 border-t border-secondary pt-6">
              <h3 className="text-md font-semibold text-primary">Notes</h3>
              <p className="mt-2 whitespace-pre-wrap text-md text-secondary">{customer.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Rental History */}
      <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">Rental History</h3>
            {customer.rentals && customer.rentals.length > 0 && (
              <BadgeWithDot color="gray" type="modern" size="sm">
                {customer.rentals.length} {customer.rentals.length === 1 ? 'rental' : 'rentals'}
              </BadgeWithDot>
            )}
          </div>

          {customer.rentals && customer.rentals.length > 0 ? (
            <div className="mt-6 space-y-3">
              {customer.rentals.map((rental: any) => (
                <Link
                  key={rental.id}
                  href={`${ROUTES.RENTALS}/${rental.id}`}
                  className="block rounded-lg border border-secondary bg-primary p-4 transition-all hover:border-utility-brand-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary_subtle">
                        <File01 className="h-5 w-5 text-tertiary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">
                          Rental #{rental.rental_number}
                        </p>
                        <p className="mt-0.5 text-sm text-tertiary">
                          {new Date(rental.start_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          -{' '}
                          {new Date(rental.end_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        {formatCurrency(rental.total_amount)}
                      </p>
                      <BadgeWithDot
                        color={
                          rental.status === 'active'
                            ? 'success'
                            : rental.status === 'completed'
                              ? 'gray'
                              : rental.status === 'overdue'
                                ? 'error'
                                : 'warning'
                        }
                        type="modern"
                        size="sm"
                        className="mt-1 capitalize"
                      >
                        {rental.status}
                      </BadgeWithDot>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState size="md">
                <EmptyState.Header>
                  <EmptyState.FeaturedIcon icon={File01} color="gray" theme="modern" />
                </EmptyState.Header>
                <EmptyState.Content>
                  <EmptyState.Title>No rental history</EmptyState.Title>
                  <EmptyState.Description>
                    This customer hasn't made any rentals yet.
                  </EmptyState.Description>
                </EmptyState.Content>
              </EmptyState>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
