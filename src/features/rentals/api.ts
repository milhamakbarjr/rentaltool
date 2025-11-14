/**
 * Rental API Functions
 *
 * Supabase queries for rental management
 */

import { createClient } from '@/lib/supabase/client'
import type { RentalFormData, RentalFilterData, ProcessReturnFormData } from './schemas/rental-schema'

/**
 * Get all rentals for the current user
 */
export async function getRentals(filters?: RentalFilterData) {
  const supabase = createClient()
  let query = supabase
    .from('rentals')
    .select(`
      *,
      customer:customers(id, full_name, email, phone_number),
      rental_items(
        id,
        quantity,
        rate_type,
        rate_amount,
        subtotal,
        inventory_item:inventory_items(id, name)
      )
    `)

  // Apply search filter (rental number or customer name)
  if (filters?.search) {
    query = query.or(`rental_number.ilike.%${filters.search}%`)
  }

  // Apply customer filter
  if (filters?.customer_id) {
    query = query.eq('customer_id', filters.customer_id)
  }

  // Apply status filter
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  // Apply date range filters
  if (filters?.start_date_from) {
    query = query.gte('start_date', filters.start_date_from)
  }
  if (filters?.start_date_to) {
    query = query.lte('start_date', filters.start_date_to)
  }

  // Apply sorting
  const sortBy = filters?.sort_by || 'created_at'
  const sortOrder = filters?.sort_order || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  if (error) throw error

  // Map database column names to frontend field names
  return data?.map((rental: any) => ({
    ...rental,
    customer: rental.customer ? {
      id: rental.customer.id,
      name: rental.customer.full_name,
      email: rental.customer.email,
      phone: rental.customer.phone_number,
    } : null
  }))
}

/**
 * Get a single rental by ID with all details
 */
export async function getRental(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rentals')
    .select(`
      *,
      customer:customers(id, full_name, email, phone_number, address),
      rental_items(
        id,
        inventory_item_id,
        quantity,
        rate_type,
        rate_amount,
        subtotal,
        condition_before,
        condition_after,
        notes,
        inventory_item:inventory_items(
          id,
          name,
          photos,
          quantity_total,
          quantity_available
        )
      ),
      payments(
        id,
        amount,
        payment_method,
        payment_date,
        notes
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  // Map database column names to frontend field names
  if (data && data.customer) {
    return {
      ...data,
      customer: {
        id: data.customer.id,
        name: data.customer.full_name,
        email: data.customer.email,
        phone: data.customer.phone_number,
        address: data.customer.address,
      }
    }
  }

  return data
}

/**
 * Create a new rental
 */
export async function createRental(data: RentalFormData, userId: string) {
  const supabase = createClient()

  // Clean up data
  const cleanData = {
    user_id: userId,
    customer_id: data.customer_id,
    start_date: data.start_date,
    end_date: data.end_date,
    return_date: data.return_date || null,
    status: data.status || 'draft',
    total_amount: data.total_amount || 0,
    deposit_amount: data.deposit_amount || 0,
    notes: data.notes || null,
  }

  // Create rental
  const { data: newRental, error: rentalError } = await supabase
    .from('rentals')
    .insert(cleanData)
    .select()
    .single()

  if (rentalError) throw rentalError

  // Create rental items
  const rentalItems = data.items.map(item => ({
    rental_id: newRental.id,
    inventory_item_id: item.inventory_item_id,
    quantity: item.quantity,
    rate_type: item.rate_type,
    rate_amount: item.rate_amount,
    subtotal: item.subtotal,
    condition_before: item.condition_before || null,
    notes: item.notes || null,
  }))

  const { error: itemsError } = await supabase
    .from('rental_items')
    .insert(rentalItems)

  if (itemsError) throw itemsError

  return newRental
}

/**
 * Update a rental
 */
export async function updateRental(id: string, data: Partial<RentalFormData>) {
  const supabase = createClient()

  // Clean up data
  const cleanData = {
    customer_id: data.customer_id,
    start_date: data.start_date,
    end_date: data.end_date,
    return_date: data.return_date || null,
    status: data.status,
    total_amount: data.total_amount,
    deposit_amount: data.deposit_amount,
    notes: data.notes || null,
  }

  const { data: updatedRental, error } = await supabase
    .from('rentals')
    .update(cleanData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  // If items are provided, update them
  if (data.items) {
    // Delete existing items
    const { error: deleteError } = await supabase
      .from('rental_items')
      .delete()
      .eq('rental_id', id)

    if (deleteError) throw deleteError

    // Insert new items
    const rentalItems = data.items.map(item => ({
      rental_id: id,
      inventory_item_id: item.inventory_item_id,
      quantity: item.quantity,
      rate_type: item.rate_type,
      rate_amount: item.rate_amount,
      subtotal: item.subtotal,
      condition_before: item.condition_before || null,
      condition_after: item.condition_after || null,
      notes: item.notes || null,
    }))

    const { error: itemsError } = await supabase
      .from('rental_items')
      .insert(rentalItems)

    if (itemsError) throw itemsError
  }

  return updatedRental
}

/**
 * Delete a rental
 */
export async function deleteRental(id: string) {
  const supabase = createClient()

  // Rental items will be cascade deleted due to foreign key constraints
  const { error } = await supabase
    .from('rentals')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Process rental return
 */
export async function processReturn(rentalId: string, data: ProcessReturnFormData) {
  const supabase = createClient()

  // Update rental status and return date
  const { error: rentalError } = await supabase
    .from('rentals')
    .update({
      status: 'completed',
      return_date: data.return_date,
      notes: data.notes || null,
    })
    .eq('id', rentalId)

  if (rentalError) throw rentalError

  // Update rental items with condition after
  for (const item of data.items) {
    const { error: itemError } = await supabase
      .from('rental_items')
      .update({
        condition_after: item.condition_after,
        notes: item.notes || null,
      })
      .eq('id', item.rental_item_id)

    if (itemError) throw itemError
  }

  // If there are additional charges, create a payment record
  if (data.additional_charges && data.additional_charges > 0) {
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        rental_id: rentalId,
        amount: data.additional_charges,
        payment_method: 'cash', // Default, can be changed
        payment_date: data.return_date,
        notes: 'Additional charges on return',
      })

    if (paymentError) throw paymentError
  }
}

/**
 * Check item availability for a date range
 */
export async function checkItemAvailability(
  itemId: string,
  startDate: string,
  endDate: string,
  excludeRentalId?: string
) {
  const supabase = createClient()

  // Call the database function
  const { data, error } = await supabase.rpc('check_item_availability', {
    p_item_id: itemId,
    p_start_date: startDate,
    p_end_date: endDate,
    p_exclude_rental_id: excludeRentalId || null,
  })

  if (error) throw error
  return data as number // Returns available quantity
}

/**
 * Calculate rental cost
 */
export function calculateRentalCost(
  rateAmount: number,
  rateType: 'hourly' | 'daily' | 'weekly' | 'monthly',
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffMs = end.getTime() - start.getTime()

  let duration: number

  switch (rateType) {
    case 'hourly':
      duration = Math.ceil(diffMs / (1000 * 60 * 60)) // Hours
      break
    case 'daily':
      duration = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) // Days
      break
    case 'weekly':
      duration = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7)) // Weeks
      break
    case 'monthly':
      duration = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30)) // Approximate months
      break
    default:
      duration = 1
  }

  return rateAmount * Math.max(1, duration)
}
