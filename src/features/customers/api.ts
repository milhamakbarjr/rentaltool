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

  // Map database column names to frontend field names
  type CustomerRow = { full_name: string; phone_number: string }
  return data?.map((customer) => ({
    ...customer,
    name: (customer as CustomerRow).full_name,
    phone: (customer as CustomerRow).phone_number,
  }))
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

  // Map database column names to frontend field names
  if (data) {
    return {
      ...data,
      name: data.full_name,
      phone: data.phone_number,
    }
  }

  return data
}

/**
 * Create a new customer
 */
export async function createCustomer(data: CustomerFormData, userId: string) {
  const supabase = createClient()

  // Map frontend field names to database column names and clean up empty strings
  const cleanData = {
    full_name: data.name,
    email: data.email || null,
    phone_number: data.phone || null,
    address: data.address || null,
    notes: data.notes || null,
    tags: data.tags || [],
    user_id: userId,
  }

  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert(cleanData)
    .select()
    .single()

  if (error) throw error

  // Map database column names back to frontend field names
  return {
    ...newCustomer,
    name: newCustomer.full_name,
    phone: newCustomer.phone_number,
  }
}

/**
 * Update a customer
 */
export async function updateCustomer(id: string, data: CustomerFormData) {
  const supabase = createClient()

  // Map frontend field names to database column names and clean up empty strings
  const cleanData = {
    full_name: data.name,
    email: data.email || null,
    phone_number: data.phone || null,
    address: data.address || null,
    notes: data.notes || null,
    tags: data.tags || [],
  }

  const { data: updatedCustomer, error } = await supabase
    .from('customers')
    .update(cleanData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  // Map database column names back to frontend field names
  return {
    ...updatedCustomer,
    name: updatedCustomer.full_name,
    phone: updatedCustomer.phone_number,
  }
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
  type CustomerWithTags = { tags: string[] | null }
  const allTags = data?.flatMap((c) => (c as CustomerWithTags).tags || []) || []
  const uniqueTags = [...new Set(allTags)].sort()

  return uniqueTags
}
