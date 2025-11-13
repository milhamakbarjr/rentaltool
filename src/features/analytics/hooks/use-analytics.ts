/**
 * Analytics React Query Hooks
 *
 * Hooks for dashboard analytics and metrics
 */

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/utils/constants'
import {
  getDashboardStats,
  getRevenueByDate,
  getTopItems,
  getRecentRentals,
} from '../api'

/**
 * Query: Get dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 60000, // 1 minute
  })
}

/**
 * Query: Get revenue by date range
 */
export function useRevenueByDate(startDate: string, endDate: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'revenue', startDate, endDate],
    queryFn: () => getRevenueByDate(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 60000,
  })
}

/**
 * Query: Get top rented items
 */
export function useTopItems(limit: number = 5) {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'top-items', limit],
    queryFn: () => getTopItems(limit),
    staleTime: 60000,
  })
}

/**
 * Query: Get recent rentals
 */
export function useRecentRentals(limit: number = 10) {
  return useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS, 'recent-rentals', limit],
    queryFn: () => getRecentRentals(limit),
    staleTime: 60000,
  })
}
