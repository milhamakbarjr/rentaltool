/**
 * Inventory Validation Schemas
 *
 * Zod schemas for validating inventory forms
 */

import { z } from 'zod'

/**
 * Pricing Schema
 */
const pricingSchema = z.object({
  hourly: z.number().min(0).optional().nullable(),
  daily: z.number().min(0).optional().nullable(),
  weekly: z.number().min(0).optional().nullable(),
  monthly: z.number().min(0).optional().nullable(),
}).refine((data) => {
  // At least one rate must be provided
  return data.hourly || data.daily || data.weekly || data.monthly
}, {
  message: 'At least one pricing rate is required',
})

export type Pricing = z.infer<typeof pricingSchema>

/**
 * Add/Edit Inventory Item Schema
 */
export const inventoryItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  category_id: z.string().uuid('Invalid category').optional().nullable(),
  quantity_total: z.number().min(1, 'Quantity must be at least 1').int('Quantity must be a whole number').optional().default(1),
  condition: z.enum(['new', 'good', 'fair', 'needs_repair']).optional().default('good'),
  purchase_cost: z.number().min(0, 'Purchase cost cannot be negative').optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  pricing: pricingSchema,
  deposit_required: z.number().min(0, 'Deposit cannot be negative').optional().default(0),
  minimum_rental_period: z.number().min(1, 'Minimum period must be at least 1 hour').int().optional().default(24),
  photos: z.array(z.string().url()).max(5, 'Maximum 5 photos allowed').optional().default([]),
  specifications: z.record(z.string(), z.any()).optional().default({}),
  status: z.enum(['available', 'rented', 'maintenance', 'retired']).optional().default('available'),
})

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>

/**
 * Category Schema
 */
export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  icon: z.string().max(10, 'Icon is too long').optional().nullable(),
  sort_order: z.number().int().default(0),
})

export type CategoryFormData = z.infer<typeof categorySchema>

/**
 * Search/Filter Schema
 */
export const inventoryFilterSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().uuid().optional(),
  status: z.enum(['available', 'rented', 'maintenance', 'retired']).optional(),
  condition: z.enum(['new', 'good', 'fair', 'needs_repair']).optional(),
  sort_by: z.enum(['name', 'created_at', 'quantity_total', 'daily_rate']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
})

export type InventoryFilterData = z.infer<typeof inventoryFilterSchema>
