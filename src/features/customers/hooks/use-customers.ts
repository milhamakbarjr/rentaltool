/**
 * Customer React Query Hooks
 *
 * Hooks for managing customer data with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { QUERY_KEYS } from '@/utils/constants'
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerTags,
} from '../api'
import type { CustomerFormData, CustomerFilterData } from '../schemas/customer-schema'

/**
 * Query: Get all customers with optional filters
 */
export function useCustomers(filters?: CustomerFilterData) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, filters],
    queryFn: () => getCustomers(filters),
  })
}

/**
 * Query: Get a single customer by ID with rental history
 */
export function useCustomer(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  })
}

/**
 * Query: Get all unique customer tags
 */
export function useCustomerTags() {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, 'tags'],
    queryFn: getCustomerTags,
  })
}

/**
 * Mutation: Create a new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: CustomerFormData) => {
      if (!user) throw new Error('Not authenticated')
      return createCustomer(data, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] })
    },
  })
}

/**
 * Mutation: Update a customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CustomerFormData }) => {
      return updateCustomer(id, data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS, variables.id] })
    },
  })
}

/**
 * Mutation: Delete a customer
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] })
    },
  })
}
