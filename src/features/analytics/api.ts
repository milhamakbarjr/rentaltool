/**
 * Analytics API Functions
 *
 * Queries for dashboard analytics and business metrics
 */

import { createClient } from '@/lib/supabase/client'

export interface DashboardStats {
  total_revenue: number
  total_rentals: number
  active_rentals: number
  total_customers: number
  total_items: number
  available_items: number
}

export interface RevenueData {
  date: string
  amount: number
}

export interface TopItem {
  id: string
  name: string
  rental_count: number
  total_revenue: number
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()

  // Get total revenue from all rentals
  const { data: revenueData } = await supabase
    .from('rentals')
    .select('total_amount')
    .in('status', ['completed', 'active'])

  const total_revenue = revenueData?.reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0

  // Get rental counts
  const { count: total_rentals } = await supabase
    .from('rentals')
    .select('*', { count: 'exact', head: true })

  const { count: active_rentals } = await supabase
    .from('rentals')
    .select('*', { count: 'exact', head: true })
    .in('status', ['active', 'overdue'])

  // Get customer count
  const { count: total_customers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  // Get inventory counts
  const { count: total_items } = await supabase
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })

  const { count: available_items } = await supabase
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'available')

  return {
    total_revenue,
    total_rentals: total_rentals || 0,
    active_rentals: active_rentals || 0,
    total_customers: total_customers || 0,
    total_items: total_items || 0,
    available_items: available_items || 0,
  }
}

/**
 * Get revenue by date range
 */
export async function getRevenueByDate(
  startDate: string,
  endDate: string
): Promise<RevenueData[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('rentals')
    .select('start_date, total_amount')
    .gte('start_date', startDate)
    .lte('start_date', endDate)
    .in('status', ['completed', 'active'])
    .order('start_date', { ascending: true })

  if (error) throw error

  // Group by date
  const revenueByDate: Record<string, number> = {}
  data?.forEach((rental) => {
    const date = rental.start_date.split('T')[0]
    revenueByDate[date] = (revenueByDate[date] || 0) + (rental.total_amount || 0)
  })

  return Object.entries(revenueByDate).map(([date, amount]) => ({
    date,
    amount,
  }))
}

/**
 * Get top rented items
 */
export async function getTopItems(limit: number = 5): Promise<TopItem[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('rental_items')
    .select(`
      inventory_item_id,
      quantity,
      subtotal,
      inventory_item:inventory_items(id, name)
    `)

  if (error) throw error

  // Group by item and calculate stats
  const itemStats: Record<string, { name: string; rental_count: number; total_revenue: number }> = {}

  data?.forEach((item: any) => {
    const itemId = item.inventory_item_id
    const itemName = item.inventory_item?.name || 'Unknown'

    if (!itemStats[itemId]) {
      itemStats[itemId] = {
        name: itemName,
        rental_count: 0,
        total_revenue: 0,
      }
    }

    itemStats[itemId].rental_count += item.quantity || 1
    itemStats[itemId].total_revenue += item.subtotal || 0
  })

  // Convert to array and sort by rental count
  const topItems = Object.entries(itemStats)
    .map(([id, stats]) => ({
      id,
      ...stats,
    }))
    .sort((a, b) => b.rental_count - a.rental_count)
    .slice(0, limit)

  return topItems
}

/**
 * Get recent rentals
 */
export async function getRecentRentals(limit: number = 10) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('rentals')
    .select(`
      *,
      customer:customers(id, name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
