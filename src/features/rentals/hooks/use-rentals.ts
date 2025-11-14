/**
 * Rental React Query Hooks
 *
 * Hooks for managing rental data with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { QUERY_KEYS } from '@/utils/constants'
import {
  getRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental,
  processReturn,
  checkItemAvailability,
} from '../api'
import type { RentalFormData, RentalFilterData, ProcessReturnFormData } from '../schemas/rental-schema'

/**
 * Query: Get all rentals with optional filters
 */
export function useRentals(filters?: RentalFilterData) {
  return useQuery({
    queryKey: [QUERY_KEYS.RENTALS, filters],
    queryFn: () => getRentals(filters),
  })
}

/**
 * Query: Get a single rental by ID with all details
 */
export function useRental(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.RENTAL, id],
    queryFn: () => getRental(id),
    enabled: !!id,
  })
}

/**
 * Query: Check item availability
 */
export function useItemAvailability(
  itemId: string,
  startDate: string,
  endDate: string,
  excludeRentalId?: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, 'availability', itemId, startDate, endDate, excludeRentalId],
    queryFn: () => checkItemAvailability(itemId, startDate, endDate, excludeRentalId),
    enabled: !!itemId && !!startDate && !!endDate,
  })
}

/**
 * Mutation: Create a new rental
 */
export function useCreateRental() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: RentalFormData) => {
      if (!user) throw new Error('Not authenticated')
      return createRental(data, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RENTALS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] })
    },
  })
}

/**
 * Mutation: Update a rental
 */
export function useUpdateRental() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RentalFormData> }) => {
      return updateRental(id, data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RENTALS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RENTAL, variables.id] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] })
    },
  })
}

/**
 * Mutation: Delete a rental
 */
export function useDeleteRental() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRental(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RENTALS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] })
    },
  })
}

/**
 * Mutation: Process rental return
 */
export function useProcessReturn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rentalId, data }: { rentalId: string; data: ProcessReturnFormData }) => {
      return processReturn(rentalId, data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RENTALS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RENTAL, variables.rentalId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENTS] })
    },
  })
}
