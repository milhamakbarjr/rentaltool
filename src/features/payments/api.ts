/**
 * Payment API Functions
 *
 * Supabase queries for payment management
 */

import { createClient } from '@/lib/supabase/client'

/**
 * Get all payments with rental info
 */
export async function getPayments() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      rental:rentals(
        id,
        rental_number,
        customer:customers(id, name)
      )
    `)
    .order('payment_date', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get payments for a specific rental
 */
export async function getPaymentsByRental(rentalId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('rental_id', rentalId)
    .order('payment_date', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Create a new payment
 */
export async function createPayment(data: {
  rental_id: string
  amount: number
  payment_method: string
  payment_date: string
  notes?: string
}) {
  const supabase = createClient()
  const { data: newPayment, error } = await supabase
    .from('payments')
    .insert({
      ...data,
      notes: data.notes || null,
    })
    .select()
    .single()

  if (error) throw error
  return newPayment
}

/**
 * Get payment summary
 */
export async function getPaymentSummary() {
  const supabase = createClient()

  // Get all payments
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, payment_method, payment_date')

  const total = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  // Get unpaid rentals
  const { data: rentals } = await supabase
    .from('rentals')
    .select('total_amount, payments(amount)')
    .in('status', ['active', 'upcoming', 'overdue'])

  let totalOutstanding = 0
  rentals?.forEach((rental: any) => {
    const paid = rental.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0
    totalOutstanding += Math.max(0, (rental.total_amount || 0) - paid)
  })

  return {
    total_received: total,
    total_outstanding: totalOutstanding,
    payment_count: payments?.length || 0,
  }
}
