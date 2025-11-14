/**
 * i18n Request Configuration
 *
 * Handles loading messages based on locale
 */

import { getRequestConfig } from 'next-intl/server'
import { getUserLocale } from './locale'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Asia/Jakarta',
    now: new Date(),
  }
})
