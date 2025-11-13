/**
 * Rental Validation Schemas
 *
 * Zod schemas for validating rental forms
 */

import { z } from 'zod'

/**
 * Rental Item Schema (items within a rental)
 */
export const rentalItemSchema = z.object({
  inventory_item_id: z.string().uuid('Invalid item'),
  quantity: z.number().min(1, 'Quantity must be at least 1').int(),
  rate_type: z.enum(['hourly', 'daily', 'weekly', 'monthly']),
  rate_amount: z.number().min(0, 'Rate must be positive'),
  subtotal: z.number().min(0),
  condition_before: z.enum(['new', 'good', 'fair', 'needs_repair']).optional(),
  condition_after: z.enum(['new', 'good', 'fair', 'needs_repair']).optional().nullable(),
  notes: z.string().max(500).optional().nullable().or(z.literal('')),
})

export type RentalItemFormData = z.infer<typeof rentalItemSchema>

/**
 * Create/Edit Rental Schema
 */
export const rentalSchema = z.object({
  customer_id: z.string().uuid('Please select a customer'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  return_date: z.string().optional().nullable().or(z.literal('')),
  status: z.enum(['draft', 'upcoming', 'active', 'completed', 'cancelled', 'overdue']).optional().default('draft'),
  total_amount: z.number().min(0).optional().default(0),
  deposit_amount: z.number().min(0).optional().default(0),
  notes: z.string().max(1000).optional().nullable().or(z.literal('')),
  items: z.array(rentalItemSchema).min(1, 'At least one item is required'),
}).refine((data) => {
  // Validate end date is after start date
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) >= new Date(data.start_date)
  }
  return true
}, {
  message: 'End date must be after or equal to start date',
  path: ['end_date'],
})

export type RentalFormData = z.infer<typeof rentalSchema>

/**
 * Process Return Schema
 */
export const processReturnSchema = z.object({
  return_date: z.string().min(1, 'Return date is required'),
  items: z.array(
    z.object({
      rental_item_id: z.string().uuid(),
      condition_after: z.enum(['new', 'good', 'fair', 'needs_repair']),
      notes: z.string().max(500).optional().nullable().or(z.literal('')),
    })
  ).min(1),
  additional_charges: z.number().min(0).optional().default(0),
  notes: z.string().max(1000).optional().nullable().or(z.literal('')),
})

export type ProcessReturnFormData = z.infer<typeof processReturnSchema>

/**
 * Search/Filter Schema
 */
export const rentalFilterSchema = z.object({
  search: z.string().optional(),
  customer_id: z.string().uuid().optional(),
  status: z.enum(['draft', 'upcoming', 'active', 'completed', 'cancelled', 'overdue']).optional(),
  start_date_from: z.string().optional(),
  start_date_to: z.string().optional(),
  sort_by: z.enum(['rental_number', 'start_date', 'total_amount', 'created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
})

export type RentalFilterData = z.infer<typeof rentalFilterSchema>
