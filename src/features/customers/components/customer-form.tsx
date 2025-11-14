/**
 * Customer Form Component
 *
 * Form for creating/editing customers using Untitled UI components
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateCustomer, useUpdateCustomer } from '../hooks/use-customers'
import { customerSchema, type CustomerFormData } from '../schemas/customer-schema'
import { ROUTES } from '@/utils/constants'
import { Button } from '@/components/base/buttons/button'
import { Input } from '@/components/base/input/input'
import { TextArea } from '@/components/base/textarea/textarea'
import { Tag, TagGroup, TagList } from '@/components/base/tags/tags'
import { Form } from '@/components/base/form/form'

interface CustomerFormProps {
  initialData?: CustomerFormData
  customerId?: string
  mode?: 'create' | 'edit'
}

export function CustomerForm({ initialData, customerId, mode = 'create' }: CustomerFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')

  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      notes: initialData?.notes || '',
      tags: initialData?.tags || [],
    },
  })

  const tags = watch('tags')

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setError(null)

      if (mode === 'edit' && customerId) {
        await updateMutation.mutateAsync({ id: customerId, data })
      } else {
        await createMutation.mutateAsync(data)
      }

      router.push(ROUTES.CUSTOMERS)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save customer')
      console.error('Form error:', err)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-utility-error-50 p-4 ring-1 ring-utility-error-200">
          <p className="text-sm text-utility-error-700">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-primary">Basic Information</h3>
          <p className="mt-1 text-sm text-tertiary">
            Enter the customer's contact details
          </p>
        </div>

        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              label="Customer Name"
              placeholder="e.g., John Doe"
              isRequired
              isInvalid={!!errors.name}
              hint={errors.name?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* Email & Phone */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                label="Email"
                placeholder="john@example.com"
                isInvalid={!!errors.email}
                hint={errors.email?.message}
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                type="tel"
                label="Phone"
                placeholder="+65 1234 5678"
                isInvalid={!!errors.phone}
                hint={errors.phone?.message}
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Address */}
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextArea
              label="Address"
              placeholder="Customer's address..."
              rows={3}
              isInvalid={!!errors.address}
              hint={errors.address?.message}
              value={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Tags */}
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-primary">Tags</h3>
          <p className="mt-1 text-sm text-tertiary">
            Add tags to organize and categorize customers
          </p>
        </div>

        {/* Tag Input */}
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="e.g., VIP, Regular"
            value={tagInput}
            onChange={setTagInput}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            color="secondary"
            size="md"
            onClick={handleAddTag}
          >
            Add
          </Button>
        </div>

        {/* Tag List */}
        {tags.length > 0 && (
          <TagGroup label="Customer tags" selectionMode="none">
            <TagList items={tags.map(tag => ({ id: tag, label: tag }))} className="flex flex-wrap gap-2">
              {(item) => (
                <Tag id={item.id} onClose={handleRemoveTag}>
                  {item.label}
                </Tag>
              )}
            </TagList>
          </TagGroup>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-primary">Additional Notes</h3>
          <p className="mt-1 text-sm text-tertiary">
            Add any additional information about this customer
          </p>
        </div>

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextArea
              label="Notes"
              placeholder="Any additional notes about this customer..."
              rows={4}
              isInvalid={!!errors.notes}
              hint={errors.notes?.message}
              value={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-secondary pt-6">
        <Button
          type="button"
          color="secondary"
          size="md"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          size="md"
          isDisabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : mode === 'edit'
              ? 'Update Customer'
              : 'Create Customer'}
        </Button>
      </div>
    </Form>
  )
}
