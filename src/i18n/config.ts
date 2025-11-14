/**
 * i18n Configuration
 *
 * Locale configuration for internationalization
 */

export const locales = ['id', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'id'

export const localeConfigs = {
  id: {
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    currency: 'IDR',
    currencySymbol: 'Rp',
    timezone: 'Asia/Jakarta',
    dateFormat: 'dd/MM/yyyy',
    locale: 'id-ID',
  },
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    currency: 'IDR', // Keep IDR for Indonesia-based business
    currencySymbol: 'Rp',
    timezone: 'Asia/Jakarta',
    dateFormat: 'dd/MM/yyyy',
    locale: 'en-ID',
  },
} as const

export const timezones = [
  { value: 'Asia/Jakarta', label: 'WIB - Western Indonesia (UTC+7)', offset: '+07:00' },
  { value: 'Asia/Makassar', label: 'WITA - Central Indonesia (UTC+8)', offset: '+08:00' },
  { value: 'Asia/Jayapura', label: 'WIT - Eastern Indonesia (UTC+9)', offset: '+09:00' },
] as const

export const currencies = [
  { value: 'IDR', label: 'Indonesian Rupiah (Rp)', symbol: 'Rp' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'SGD', label: 'Singapore Dollar (S$)', symbol: 'S$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
] as const
