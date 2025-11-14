/**
 * Rentals List Page
 *
 * View and manage all rentals
 */

import { requireAuth } from '@/lib/auth/guards'
import { RentalsMain } from '@/features/rentals/components/rentals-main'

export default async function RentalsPage() {
  await requireAuth()

  return <RentalsMain />
}
