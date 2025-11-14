/**
 * Payment React Query Hooks
 *
 * Hooks for managing payment data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/utils/constants'
import {
  getPayments,
  getPaymentsByRental,
  createPayment,
  getPaymentSummary,
} from '../api'

/**
 * Query: Get all payments
 */
export function usePayments() {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS],
    queryFn: getPayments,
  })
}

/**
 * Query: Get payments for a rental
 */
export function usePaymentsByRental(rentalId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS, rentalId],
    queryFn: () => getPaymentsByRental(rentalId),
    enabled: !!rentalId,
  })
}

/**
 * Query: Get payment summary
 */
export function usePaymentSummary() {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS, 'summary'],
    queryFn: getPaymentSummary,
  })
}

/**
 * Mutation: Create a payment
 */
export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYMENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RENTALS] })
    },
  })
}
