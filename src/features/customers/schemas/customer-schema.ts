/**
 * Customer Validation Schemas
 *
 * Zod schemas for validating customer forms
 */

import { z } from 'zod'

/**
 * Add/Edit Customer Schema
 */
export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  phone: z.string().max(20, 'Phone number is too long').optional().nullable().or(z.literal('')),
  address: z.string().max(500, 'Address is too long').optional().nullable().or(z.literal('')),
  notes: z.string().max(1000, 'Notes are too long').optional().nullable().or(z.literal('')),
  tags: z.array(z.string()),
})

export type CustomerFormData = z.infer<typeof customerSchema>

/**
 * Search/Filter Schema
 */
export const customerFilterSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  sort_by: z.enum(['name', 'created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
})

export type CustomerFilterData = z.infer<typeof customerFilterSchema>
