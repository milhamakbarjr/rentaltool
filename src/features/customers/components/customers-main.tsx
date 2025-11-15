/**
 * Customers Main Component
 *
 * Main customers page with header and list
 */

'use client'

import { useTranslations } from 'next-intl'
import { Plus } from '@untitledui/icons'
import { Button } from '@/components/base/buttons/button'
import { ROUTES } from '@/utils/constants'
import { CustomerList } from './customer-list'

export function CustomersMain() {
  const t = useTranslations('customers')

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
                    href={`${ROUTES.CUSTOMERS}/new`}
                    color="primary"
                    size="md"
                    iconLeading={Plus}
                  >
                    {t('addCustomer')}
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
