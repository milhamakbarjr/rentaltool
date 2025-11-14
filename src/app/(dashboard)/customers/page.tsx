/**
 * Customers List Page
 *
 * View and manage all customers
 */

import { requireAuth } from '@/lib/auth/guards'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ROUTES } from '@/utils/constants'
import { CustomerList } from '@/features/customers/components/customer-list'
import { Button } from '@/components/base/buttons/button'
import { Plus } from '@untitledui/icons'

export default async function CustomersPage() {
  await requireAuth()
  const t = await getTranslations('customers')

  return (
    <div className="bg-primary">
      <main className="bg-primary pt-8 pb-12 lg:pt-12 lg:pb-24">
        <div className="flex flex-col gap-8">
          <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 lg:px-8">
            {/* Page header */}
            <div className="relative flex flex-col gap-5 bg-primary">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h1 className="text-display-sm font-semibold text-primary">
                    {t('title')}
                  </h1>
                  <p className="mt-1 text-md text-tertiary">
                    {t('subtitle')}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    asChild
                    hierarchy="primary"
                    size="md"
                  >
                    <Link href={`${ROUTES.CUSTOMERS}/new`}>
                      <Plus className="h-5 w-5" />
                      {t('addCustomer')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Customer List */}
            <CustomerList />
          </div>
        </div>
      </main>
    </div>
  )
}
