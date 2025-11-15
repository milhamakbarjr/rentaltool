/**
 * Inventory Add Modal Component
 *
 * Modal for creating new inventory items using Untitled UI patterns with mobile-first approach
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Package } from '@untitledui/icons'
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from 'react-aria-components'
import { Dialog, Modal, ModalOverlay } from '@/components/application/modals/modal'
import { Carousel, CarouselContext } from '@/components/application/carousel/carousel-base'
import { Button } from '@/components/base/buttons/button'
import { CloseButton } from '@/components/base/buttons/close-button'
import { Input } from '@/components/base/input/input'
import { Label } from '@/components/base/input/label'
import { CurrencyInput } from '@/components/base/input/currency-input'
import { Select } from '@/components/base/select/select'
import { TextAreaBase } from '@/components/base/textarea/textarea'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'
import { BackgroundPattern } from '@/components/shared-assets/background-patterns'
import { useCreateInventoryItem, useCategories } from '../hooks/use-inventory'
import { inventoryItemSchema, type InventoryItemFormData } from '../schemas/inventory-schema'
import { ITEM_CONDITION_LABELS } from '@/utils/constants'

interface InventoryAddModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const conditionOptions = [
  { id: 'new', label: ITEM_CONDITION_LABELS.new },
  { id: 'good', label: ITEM_CONDITION_LABELS.good },
  { id: 'fair', label: ITEM_CONDITION_LABELS.fair },
  { id: 'needs_repair', label: ITEM_CONDITION_LABELS.needs_repair },
]

const statusOptions = [
  { id: 'available', label: 'Available' },
  { id: 'rented', label: 'Rented' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'retired', label: 'Retired' },
]

export function InventoryAddModal({ isOpen, onOpenChange }: InventoryAddModalProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { data: categories } = useCategories()
  const createMutation = useCreateInventoryItem()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      quantity_total: 1,
      condition: 'good' as const,
      status: 'available' as const,
      pricing: {
        hourly: null,
        daily: null,
        weekly: null,
        monthly: null,
      },
      deposit_required: 0,
      minimum_rental_period: 24,
      purchase_cost: null,
      purchase_date: '',
    },
  })

  const categoryOptions = [
    { id: '', label: 'No category' },
    ...(categories?.map((cat) => ({
      id: cat.id,
      label: cat.name,
      icon: cat.icon,
    })) || []),
  ]

  const onSubmit = async (data: InventoryItemFormData) => {
    try {
      setError(null)

      // Clean up empty string values
      const cleanedData = {
        ...data,
        category_id: data.category_id || null,
        description: data.description || null,
        purchase_date: data.purchase_date || null,
      }

      await createMutation.mutateAsync(cleanedData)

      // Reset form and close modal
      reset()
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create item')
      console.error('Form error:', err)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onOpenChange(false)
  }

  // Check if basic info is filled for validation
  const name = watch('name')
  const isBasicInfoValid = name && name.length >= 2

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog className="overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Carousel.Root className="relative w-full overflow-hidden rounded-xl bg-primary shadow-xl sm:max-w-160">
                <CloseButton onClick={handleClose} theme="light" size="lg" className="absolute top-3 right-3 z-20" />

                {/* Header */}
                <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                  <div className="relative w-max max-sm:hidden">
                    <FeaturedIcon color="gray" size="lg" theme="modern" icon={Package} />
                    <BackgroundPattern pattern="circle" size="sm" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="z-10 flex flex-col gap-0.5">
                    <AriaHeading slot="title" className="text-md font-semibold text-primary">
                      Add Inventory Item
                    </AriaHeading>
                    <p className="text-sm text-tertiary">Add a new item to your rental inventory</p>
                  </div>
                </div>

                <div className="h-5 w-full" />

                {/* Error Message */}
                {error && (
                  <div className="mx-4 mb-4 rounded-md bg-utility-error-50 p-4 sm:mx-6">
                    <p className="text-sm text-utility-error-700">{error}</p>
                  </div>
                )}

                {/* Carousel Content */}
                <Carousel.Content className="gap-5">
                  {/* Step 1: Basic Info */}
                  <Carousel.Item className="grid w-full grid-cols-1 items-start justify-start gap-4 px-4 sm:grid-cols-2 sm:px-6">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            size="md"
                            label="Item Name *"
                            placeholder="e.g., Power Drill"
                            hint={errors.name?.message}
                            isInvalid={!!errors.name}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5 self-stretch sm:col-span-2">
                      <Label>Description</Label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <TextAreaBase
                            className="h-24 flex-1 rounded-lg px-3.5 py-3"
                            placeholder="Brief description of the item..."
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        )}
                      />
                      {errors.description && (
                        <p className="text-sm text-utility-error-700">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="category_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            size="md"
                            label="Category"
                            placeholder="Select category"
                            items={categoryOptions}
                            selectedKey={field.value || ''}
                            onSelectionChange={(value) => field.onChange(value as string)}
                          >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                          </Select>
                        )}
                      />
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="quantity_total"
                        control={control}
                        render={({ field }) => (
                          <Input
                            size="md"
                            type="number"
                            label="Quantity *"
                            placeholder="1"
                            hint={errors.quantity_total?.message}
                            isInvalid={!!errors.quantity_total}
                            value={String(field.value ?? '')}
                            onChange={(value) => {
                              const numValue = value === '' ? 1 : parseInt(value)
                              field.onChange(isNaN(numValue) ? 1 : numValue)
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* Condition */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                          <Select
                            size="md"
                            label="Condition *"
                            placeholder="Select condition"
                            items={conditionOptions}
                            selectedKey={field.value}
                            onSelectionChange={(value) => field.onChange(value as string)}
                          >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                          </Select>
                        )}
                      />
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            size="md"
                            label="Status *"
                            placeholder="Select status"
                            items={statusOptions}
                            selectedKey={field.value}
                            onSelectionChange={(value) => field.onChange(value as string)}
                          >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                          </Select>
                        )}
                      />
                    </div>
                  </Carousel.Item>

                  {/* Step 2: Pricing */}
                  <Carousel.Item className="grid w-full grid-cols-1 items-start justify-start gap-4 px-4 sm:grid-cols-2 sm:px-6">
                    <div className="sm:col-span-2">
                      <p className="text-sm text-tertiary">At least one pricing rate is required</p>
                    </div>

                    {/* Hourly Rate */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="pricing.hourly"
                        control={control}
                        render={({ field }) => (
                          <CurrencyInput
                            size="md"
                            label="Hourly Rate"
                            placeholder="0"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    {/* Daily Rate */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="pricing.daily"
                        control={control}
                        render={({ field }) => (
                          <CurrencyInput
                            size="md"
                            label="Daily Rate"
                            placeholder="0"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    {/* Weekly Rate */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="pricing.weekly"
                        control={control}
                        render={({ field }) => (
                          <CurrencyInput
                            size="md"
                            label="Weekly Rate"
                            placeholder="0"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    {/* Monthly Rate */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="pricing.monthly"
                        control={control}
                        render={({ field }) => (
                          <CurrencyInput
                            size="md"
                            label="Monthly Rate"
                            placeholder="0"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    {errors.pricing && (
                      <div className="sm:col-span-2">
                        <p className="text-sm text-utility-error-700">{errors.pricing.message}</p>
                      </div>
                    )}
                  </Carousel.Item>

                  {/* Step 3: Additional Details */}
                  <Carousel.Item className="grid w-full grid-cols-1 items-start justify-start gap-4 px-4 sm:grid-cols-2 sm:px-6">
                    {/* Deposit Required */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="deposit_required"
                        control={control}
                        render={({ field }) => (
                          <CurrencyInput
                            size="md"
                            label="Deposit Required"
                            placeholder="0"
                            value={field.value}
                            onChange={(value) => field.onChange(value ?? 0)}
                          />
                        )}
                      />
                    </div>

                    {/* Minimum Rental Period */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="minimum_rental_period"
                        control={control}
                        render={({ field }) => (
                          <Input
                            size="md"
                            type="number"
                            label="Minimum Rental Period (hours)"
                            placeholder="24"
                            hint={errors.minimum_rental_period?.message}
                            isInvalid={!!errors.minimum_rental_period}
                            value={String(field.value ?? '')}
                            onChange={(value) => {
                              const numValue = value === '' ? 24 : parseInt(value)
                              field.onChange(isNaN(numValue) ? 24 : numValue)
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* Purchase Cost */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="purchase_cost"
                        control={control}
                        render={({ field }) => (
                          <CurrencyInput
                            size="md"
                            label="Purchase Cost"
                            placeholder="0"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    {/* Purchase Date */}
                    <div className="sm:col-span-1">
                      <Controller
                        name="purchase_date"
                        control={control}
                        render={({ field }) => (
                          <Input
                            size="md"
                            type="date"
                            label="Purchase Date"
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </Carousel.Item>
                </Carousel.Content>

                {/* Footer with Back/Next/Submit buttons */}
                <CarouselContext.Consumer>
                  {(context) => (
                    <div className="z-10 mt-6 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6">
                      <Button
                        type="button"
                        size="lg"
                        color="secondary"
                        onClick={() => {
                          if (context?.canScrollPrev) {
                            context.scrollPrev()
                          } else {
                            handleClose()
                          }
                        }}
                      >
                        {context?.canScrollPrev ? 'Back' : 'Cancel'}
                      </Button>
                      <Button
                        type={context?.canScrollNext ? 'button' : 'submit'}
                        size="lg"
                        color="primary"
                        disabled={isSubmitting || (!isBasicInfoValid && context?.selectedIndex === 0)}
                        onClick={() => {
                          if (context?.canScrollNext) {
                            context.scrollNext()
                          }
                        }}
                      >
                        {isSubmitting ? 'Creating...' : context?.canScrollNext ? 'Next' : 'Add Item'}
                      </Button>
                    </div>
                  )}
                </CarouselContext.Consumer>
              </Carousel.Root>
            </form>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  )
}
