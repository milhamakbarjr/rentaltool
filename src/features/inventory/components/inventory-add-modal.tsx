/**
 * Inventory Add Modal Component
 *
 * Modal for creating new inventory items using Untitled UI patterns
 */

'use client'

import { useState, type Key } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Package, X } from '@untitledui/icons'
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from 'react-aria-components'
import { Dialog, Modal, ModalOverlay } from '@/components/application/modals/modal'
import { Button } from '@/components/base/buttons/button'
import { CloseButton } from '@/components/base/buttons/close-button'
import { Input, InputBase } from '@/components/base/input/input'
import { InputGroup } from '@/components/base/input/input-group'
import { Label } from '@/components/base/input/label'
import { Select } from '@/components/base/select/select'
import { NativeSelect } from '@/components/base/select/select-native'
import { TextAreaBase } from '@/components/base/textarea/textarea'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'
import { BackgroundPattern } from '@/components/shared-assets/background-patterns'
import { Tabs } from '@/components/application/tabs/tabs'
import { useCreateInventoryItem, useCategories } from '../hooks/use-inventory'
import { inventoryItemSchema, type InventoryItemFormData } from '../schemas/inventory-schema'
import { ROUTES, ITEM_CONDITION_LABELS } from '@/utils/constants'

interface InventoryAddModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const tabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'details', label: 'Additional' },
]

const conditionOptions = [
  { label: ITEM_CONDITION_LABELS.new, value: 'new' },
  { label: ITEM_CONDITION_LABELS.good, value: 'good' },
  { label: ITEM_CONDITION_LABELS.fair, value: 'fair' },
  { label: ITEM_CONDITION_LABELS.needs_repair, value: 'needs_repair' },
]

const statusOptions = [
  { label: 'Available', value: 'available' },
  { label: 'Rented', value: 'rented' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Retired', value: 'retired' },
]

export function InventoryAddModal({ isOpen, onOpenChange }: InventoryAddModalProps) {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<Key>('basic')
  const [error, setError] = useState<string | null>(null)

  const { data: categories } = useCategories()
  const createMutation = useCreateInventoryItem()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
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
    setSelectedTab('basic')
    onOpenChange(false)
  }

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog className="overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative w-full overflow-hidden rounded-xl bg-primary shadow-xl sm:max-w-160">
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

                {/* Tab Navigation */}
                <div className="px-4 sm:px-6">
                  <NativeSelect
                    aria-label="Form sections"
                    value={selectedTab as string}
                    onChange={(event) => setSelectedTab(event.target.value)}
                    options={tabs.map((tab) => ({ label: tab.label, value: tab.id }))}
                    className="w-full md:hidden"
                  />
                  <Tabs selectedKey={selectedTab as string} onSelectionChange={setSelectedTab} className="w-full max-md:hidden">
                    <Tabs.List type="button-minimal" items={tabs}>
                      {(tab) => <Tabs.Item {...tab} />}
                    </Tabs.List>
                  </Tabs>
                </div>

                <div className="h-5 w-full" />

                {/* Tab Content */}
                <div className="min-h-[400px] px-4 sm:px-6">
                  {selectedTab === 'basic' && (
                    <div className="grid w-full grid-cols-1 items-start justify-start gap-4 sm:grid-cols-2">
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
                        <TextAreaBase
                          className="h-24 flex-1 rounded-lg px-3.5 py-3"
                          placeholder="Brief description of the item..."
                          {...register('description')}
                        />
                        {errors.description && (
                          <p className="text-sm text-utility-error-700">{errors.description.message}</p>
                        )}
                      </div>

                      {/* Category */}
                      <div className="sm:col-span-1">
                        <Label>Category</Label>
                        <Controller
                          name="category_id"
                          control={control}
                          render={({ field }) => (
                            <NativeSelect
                              value={field.value || ''}
                              onChange={field.onChange}
                              options={[
                                { label: 'No category', value: '' },
                                ...(categories?.map((cat) => ({
                                  label: `${cat.icon || ''} ${cat.name}`,
                                  value: cat.id,
                                })) || []),
                              ]}
                              className="mt-1.5"
                            />
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
                              value={field.value?.toString() || ''}
                              onChange={(value) => field.onChange(parseInt(value) || 0)}
                            />
                          )}
                        />
                      </div>

                      {/* Condition */}
                      <div className="sm:col-span-1">
                        <Label>Condition *</Label>
                        <Controller
                          name="condition"
                          control={control}
                          render={({ field }) => (
                            <NativeSelect {...field} options={conditionOptions} className="mt-1.5" />
                          )}
                        />
                      </div>

                      {/* Status */}
                      <div className="sm:col-span-1">
                        <Label>Status *</Label>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <NativeSelect {...field} options={statusOptions} className="mt-1.5" />
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {selectedTab === 'pricing' && (
                    <div className="grid w-full grid-cols-1 items-start justify-start gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <p className="text-sm text-tertiary">At least one pricing rate is required</p>
                      </div>

                      {/* Hourly Rate */}
                      <div className="sm:col-span-1">
                        <Controller
                          name="pricing.hourly"
                          control={control}
                          render={({ field }) => (
                            <InputGroup
                              size="md"
                              label="Hourly Rate"
                              leadingAddon={<InputGroup.Prefix>$</InputGroup.Prefix>}
                            >
                              <InputBase
                                type="number"
                                placeholder="0.00"
                                value={field.value?.toString() || ''}
                                onChange={(value) => field.onChange(parseFloat(value) || null)}
                              />
                            </InputGroup>
                          )}
                        />
                      </div>

                      {/* Daily Rate */}
                      <div className="sm:col-span-1">
                        <Controller
                          name="pricing.daily"
                          control={control}
                          render={({ field }) => (
                            <InputGroup
                              size="md"
                              label="Daily Rate"
                              leadingAddon={<InputGroup.Prefix>$</InputGroup.Prefix>}
                            >
                              <InputBase
                                type="number"
                                placeholder="0.00"
                                value={field.value?.toString() || ''}
                                onChange={(value) => field.onChange(parseFloat(value) || null)}
                              />
                            </InputGroup>
                          )}
                        />
                      </div>

                      {/* Weekly Rate */}
                      <div className="sm:col-span-1">
                        <Controller
                          name="pricing.weekly"
                          control={control}
                          render={({ field }) => (
                            <InputGroup
                              size="md"
                              label="Weekly Rate"
                              leadingAddon={<InputGroup.Prefix>$</InputGroup.Prefix>}
                            >
                              <InputBase
                                type="number"
                                placeholder="0.00"
                                value={field.value?.toString() || ''}
                                onChange={(value) => field.onChange(parseFloat(value) || null)}
                              />
                            </InputGroup>
                          )}
                        />
                      </div>

                      {/* Monthly Rate */}
                      <div className="sm:col-span-1">
                        <Controller
                          name="pricing.monthly"
                          control={control}
                          render={({ field }) => (
                            <InputGroup
                              size="md"
                              label="Monthly Rate"
                              leadingAddon={<InputGroup.Prefix>$</InputGroup.Prefix>}
                            >
                              <InputBase
                                type="number"
                                placeholder="0.00"
                                value={field.value?.toString() || ''}
                                onChange={(value) => field.onChange(parseFloat(value) || null)}
                              />
                            </InputGroup>
                          )}
                        />
                      </div>

                      {errors.pricing && (
                        <div className="sm:col-span-2">
                          <p className="text-sm text-utility-error-700">{errors.pricing.message}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTab === 'details' && (
                    <div className="grid w-full grid-cols-1 items-start justify-start gap-4 sm:grid-cols-2">
                      {/* Deposit Required */}
                      <div className="sm:col-span-1">
                        <Controller
                          name="deposit_required"
                          control={control}
                          render={({ field }) => (
                            <InputGroup
                              size="md"
                              label="Deposit Required"
                              leadingAddon={<InputGroup.Prefix>$</InputGroup.Prefix>}
                            >
                              <InputBase
                                type="number"
                                placeholder="0.00"
                                value={field.value?.toString() || ''}
                                onChange={(value) => field.onChange(parseFloat(value) || 0)}
                              />
                            </InputGroup>
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
                              value={field.value?.toString() || ''}
                              onChange={(value) => field.onChange(parseInt(value) || 0)}
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
                            <InputGroup
                              size="md"
                              label="Purchase Cost"
                              leadingAddon={<InputGroup.Prefix>$</InputGroup.Prefix>}
                            >
                              <InputBase
                                type="number"
                                placeholder="0.00"
                                value={field.value?.toString() || ''}
                                onChange={(value) => field.onChange(parseFloat(value) || null)}
                              />
                            </InputGroup>
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
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="z-10 mt-6 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6">
                  <Button
                    type="button"
                    size="lg"
                    color="secondary"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Add Item'}
                  </Button>
                </div>
              </div>
            </form>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  )
}
