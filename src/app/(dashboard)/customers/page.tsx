/**
 * Customers List Page
 *
 * View and manage all customers
 */

import { requireAuth } from '@/lib/auth/guards'
import { CustomersMain } from '@/features/customers/components/customers-main'

export default async function CustomersPage() {
  await requireAuth()

  return <CustomersMain />
}
