/**
 * Inventory Page
 *
 * View and manage all inventory items with analytics
 */

import { requireAuth } from '@/lib/auth/guards'
import { InventoryMain } from '@/features/inventory/components/inventory-main'

export default async function InventoryPage() {
  await requireAuth()

  return <InventoryMain />
}
