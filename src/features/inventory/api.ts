/**
 * Inventory API Functions
 *
 * Supabase queries for inventory management
 */

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import type { InventoryItemFormData, InventoryFilterData } from './schemas/inventory-schema'

type InventoryItem = Database['public']['Tables']['inventory_items']['Row']
type InventoryItemInsert = Database['public']['Tables']['inventory_items']['Insert']
type InventoryItemUpdate = Database['public']['Tables']['inventory_items']['Update']
type Category = Database['public']['Tables']['categories']['Row']

/**
 * Get all inventory items for current user
 */
export async function getInventoryItems(filters?: InventoryFilterData) {
  const supabase = createClient()

  let query = supabase
    .from('inventory_items')
    .select(`
      *,
      category:categories(id, name, icon)
    `)

  // Apply filters
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.condition) {
    query = query.eq('condition', filters.condition)
  }

  // Apply sorting
  const sortBy = filters?.sort_by || 'created_at'
  const sortOrder = filters?.sort_order || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data as (InventoryItem & { category: Category | null })[]
}

/**
 * Get single inventory item by ID
 */
export async function getInventoryItem(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inventory_items')
    .select(`
      *,
      category:categories(id, name, icon)
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data as InventoryItem & { category: Category | null }
}

/**
 * Create new inventory item
 */
export async function createInventoryItem(data: InventoryItemFormData, userId: string) {
  const supabase = createClient()

  const insertData: InventoryItemInsert = {
    user_id: userId,
    name: data.name,
    description: data.description || null,
    category_id: data.category_id || null,
    quantity_total: data.quantity_total,
    condition: data.condition,
    purchase_cost: data.purchase_cost || null,
    purchase_date: data.purchase_date || null,
    pricing: data.pricing as any,
    deposit_required: data.deposit_required,
    minimum_rental_period: data.minimum_rental_period,
    photos: data.photos,
    specifications: data.specifications as any,
    status: data.status,
  }

  const { data: newItem, error } = await supabase
    .from('inventory_items')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    throw error
  }

  return newItem
}

/**
 * Update inventory item
 */
export async function updateInventoryItem(id: string, data: Partial<InventoryItemFormData>) {
  const supabase = createClient()

  const updateData: InventoryItemUpdate = {
    name: data.name,
    description: data.description,
    category_id: data.category_id,
    quantity_total: data.quantity_total,
    condition: data.condition,
    purchase_cost: data.purchase_cost,
    purchase_date: data.purchase_date,
    pricing: data.pricing as any,
    deposit_required: data.deposit_required,
    minimum_rental_period: data.minimum_rental_period,
    photos: data.photos,
    specifications: data.specifications as any,
    status: data.status,
  }

  const { data: updatedItem, error } = await supabase
    .from('inventory_items')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return updatedItem
}

/**
 * Delete inventory item
 */
export async function deleteInventoryItem(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

/**
 * Get all categories for current user
 */
export async function getCategories() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

/**
 * Create new category
 */
export async function createCategory(data: { name: string; icon?: string; sort_order?: number }, userId: string) {
  const supabase = createClient()

  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name: data.name,
      icon: data.icon || null,
      sort_order: data.sort_order || 0,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return newCategory
}

/**
 * Update category
 */
export async function updateCategory(id: string, data: { name?: string; icon?: string; sort_order?: number }) {
  const supabase = createClient()

  const { data: updatedCategory, error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return updatedCategory
}

/**
 * Delete category
 */
export async function deleteCategory(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

/**
 * Check item availability for date range
 */
export async function checkItemAvailability(
  itemId: string,
  startDate: string,
  endDate: string,
  excludeRentalId?: string
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('check_item_availability', {
      p_item_id: itemId,
      p_start_date: startDate,
      p_end_date: endDate,
      p_exclude_rental_id: excludeRentalId || null,
    })

  if (error) {
    throw error
  }

  return data[0]
}
