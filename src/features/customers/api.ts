/**
 * Customer API Functions
 *
 * Supabase queries for customer management
 */

import { createClient } from '@/lib/supabase/client'
import type { CustomerFormData, CustomerFilterData } from './schemas/customer-schema'

/**
 * Get all customers for the current user
 */
export async function getCustomers(filters?: CustomerFilterData) {
  const supabase = createClient()
  let query = supabase
    .from('customers')
    .select('*')

  // Apply search filter
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
  }

  // Apply tag filter
  if (filters?.tag) {
    query = query.contains('tags', [filters.tag])
  }

  // Apply sorting
  const sortBy = filters?.sort_by || 'created_at'
  const sortOrder = filters?.sort_order || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Get a single customer by ID
 */
export async function getCustomer(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      rentals:rentals(
        id,
        rental_number,
        start_date,
        end_date,
        return_date,
        status,
        total_amount
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new customer
 */
export async function createCustomer(data: CustomerFormData, userId: string) {
  const supabase = createClient()

  // Clean up empty strings to null
  const cleanData = {
    ...data,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
    notes: data.notes || null,
    user_id: userId,
  }

  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert(cleanData)
    .select()
    .single()

  if (error) throw error
  return newCustomer
}

/**
 * Update a customer
 */
export async function updateCustomer(id: string, data: CustomerFormData) {
  const supabase = createClient()

  // Clean up empty strings to null
  const cleanData = {
    ...data,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
    notes: data.notes || null,
  }

  const { data: updatedCustomer, error } = await supabase
    .from('customers')
    .update(cleanData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return updatedCustomer
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Get all unique tags from customers
 */
export async function getCustomerTags() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('tags')

  if (error) throw error

  // Extract unique tags from all customers
  const allTags = data?.flatMap(c => c.tags || []) || []
  const uniqueTags = [...new Set(allTags)].sort()

  return uniqueTags
}
