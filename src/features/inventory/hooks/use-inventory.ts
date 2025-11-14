/**
 * Inventory React Query Hooks
 *
 * Hooks for fetching and mutating inventory data
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { QUERY_KEYS } from '@/utils/constants'
import {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  checkItemAvailability,
  getInventoryUtilization,
  getInventoryStats,
} from '../api'
import type { InventoryItemFormData, InventoryFilterData } from '../schemas/inventory-schema'

/**
 * Fetch all inventory items
 */
export function useInventoryItems(filters?: InventoryFilterData) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, filters],
    queryFn: () => getInventoryItems(filters),
  })
}

/**
 * Fetch single inventory item
 */
export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY_ITEM, id],
    queryFn: () => getInventoryItem(id),
    enabled: !!id,
  })
}

/**
 * Create inventory item mutation
 */
export function useCreateInventoryItem() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: InventoryItemFormData) => {
      if (!user) throw new Error('User not authenticated')
      return createInventoryItem(data, user.id)
    },
    onSuccess: () => {
      // Invalidate inventory list to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] })
    },
  })
}

/**
 * Update inventory item mutation
 */
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InventoryItemFormData> }) =>
      updateInventoryItem(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY_ITEM, variables.id] })
    },
  })
}

/**
 * Delete inventory item mutation
 */
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] })
    },
  })
}

/**
 * Fetch categories
 */
export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  })
}

/**
 * Create category mutation
 */
export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: { name: string; icon?: string; sort_order?: number }) => {
      if (!user) throw new Error('User not authenticated')
      return createCategory(data, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
    },
  })
}

/**
 * Update category mutation
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; icon?: string; sort_order?: number } }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
    },
  })
}

/**
 * Delete category mutation
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
    },
  })
}

/**
 * Check item availability
 */
export function useCheckAvailability(itemId: string, startDate: string, endDate: string, excludeRentalId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, 'availability', itemId, startDate, endDate, excludeRentalId],
    queryFn: () => checkItemAvailability(itemId, startDate, endDate, excludeRentalId),
    enabled: !!itemId && !!startDate && !!endDate,
  })
}

/**
 * Fetch inventory utilization/analytics
 */
export function useInventoryUtilization() {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, 'utilization'],
    queryFn: getInventoryUtilization,
  })
}

/**
 * Fetch inventory statistics
 */
export function useInventoryStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, 'stats'],
    queryFn: getInventoryStats,
  })
}
