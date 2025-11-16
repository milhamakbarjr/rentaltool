/**
 * Common Utility Functions
 *
 * Generic helper functions used throughout the application
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx and tailwind-merge for optimal className handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number as currency
 * @param amount - The amount to format
 * @param shorthand - If true, uses compact notation (e.g., 1.2K, 1.5M)
 * @param currency - Currency code (default: IDR)
 * @param locale - Locale string (default: id-ID)
 */
export function formatCurrency(
  amount: number,
  shorthand: boolean = false,
  currency: string = 'IDR',
  locale: string = 'id-ID'
): string {
  if (shorthand) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format phone number with locale support
 */
export function formatPhoneNumber(phone: string, locale: string = 'id-ID'): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Indonesian format: +62 XXX-XXXX-XXXX or 08XX-XXXX-XXXX
  if (locale.startsWith('id')) {
    // Mobile numbers starting with 62 (country code)
    if (cleaned.startsWith('62')) {
      const number = cleaned.slice(2)
      if (number.length >= 9) {
        return `+62 ${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`
      }
      return `+62 ${number}`
    }

    // Mobile numbers starting with 08
    if (cleaned.startsWith('08') && cleaned.length >= 10) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`
    }

    // Mobile numbers starting with 8 (without leading 0)
    if (cleaned.startsWith('8') && cleaned.length >= 9 && cleaned.length <= 12) {
      return `+62 ${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
    }
  }

  // Singapore format: +65 XXXX XXXX
  if (cleaned.startsWith('65') && cleaned.length === 10) {
    return `+65 ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`
  }

  // Generic international format
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, cleaned.length - 8)} ${cleaned.slice(-8, -4)} ${cleaned.slice(-4)}`
  }

  return phone
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Sleep utility for async functions
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Generate random ID
 */
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}_${id}` : id
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser() || !navigator.clipboard) {
    return false
  }

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Download data as file
 */
export function downloadFile(data: string | Blob, filename: string): void {
  const blob = typeof data === 'string' ? new Blob([data]) : data
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Format number with Indonesian thousand separators (dots)
 * @param value - Number to format
 * @returns Formatted string (e.g., 1000000 → "1.000.000")
 */
export function formatIndonesianNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return ''

  // Convert to string and split by decimal point
  const parts = value.toString().split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]

  // Add dots as thousand separators
  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Add decimal part if exists (Indonesian Rupiah typically doesn't use decimals, but handle it anyway)
  return decimalPart ? `${formatted},${decimalPart}` : formatted
}

/**
 * Parse Indonesian formatted number string to number
 * @param value - Formatted string (e.g., "1.000.000" or "1.000.000,50")
 * @returns Number value
 */
export function parseIndonesianNumber(value: string | number | null | undefined): number | null {
  // Handle non-string values
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value

  const strValue = String(value).trim()
  if (strValue === '') return null

  // Remove dots (thousand separators) and replace comma (decimal separator) with dot
  const cleaned = strValue.replace(/\./g, '').replace(/,/g, '.')
  const parsed = Number(cleaned)

  return isNaN(parsed) ? null : parsed
}

/**
 * Format date in Indonesian locale
 */
export function formatDate(date: Date | string, locale: string = 'id-ID'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  // Check if the date is valid
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided to formatDate')
  }
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
}