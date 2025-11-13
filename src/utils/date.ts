/**
 * Date Utilities
 *
 * Helper functions for date formatting and manipulation using date-fns
 */

import { format, formatDistance, isAfter, isBefore, parseISO, addDays, differenceInDays, differenceInHours, startOfDay, endOfDay } from 'date-fns'

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true })
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isBefore(dateObj, new Date())
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isAfter(dateObj, new Date())
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

/**
 * Calculate rental duration in days
 */
export function calculateRentalDuration(startDate: string | Date, endDate: string | Date): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return Math.max(1, differenceInDays(end, start))
}

/**
 * Calculate rental duration in hours
 */
export function calculateRentalDurationHours(startDate: string | Date, endDate: string | Date): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return Math.max(1, differenceInHours(end, start))
}

/**
 * Get date range for upcoming period
 */
export function getUpcomingDateRange(days: number = 7): { start: Date; end: Date } {
  const start = startOfDay(new Date())
  const end = endOfDay(addDays(start, days))
  return { start, end }
}

/**
 * Check if rental is overdue
 */
export function isRentalOverdue(endDate: string | Date, returnDate?: string | Date | null): boolean {
  if (returnDate) {
    // Already returned, not overdue
    return false
  }

  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return isBefore(end, new Date())
}

/**
 * Check if rental is due soon (within 24 hours)
 */
export function isRentalDueSoon(endDate: string | Date, returnDate?: string | Date | null): boolean {
  if (returnDate) {
    // Already returned
    return false
  }

  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  const hoursUntilDue = differenceInHours(end, new Date())

  return hoursUntilDue <= 24 && hoursUntilDue > 0
}

/**
 * Format rental period for display
 */
export function formatRentalPeriod(startDate: string | Date, endDate: string | Date): string {
  const duration = calculateRentalDuration(startDate, endDate)

  if (duration === 1) {
    return `${formatDate(startDate, 'MMM dd, yyyy')}`
  }

  return `${formatDate(startDate, 'MMM dd')} - ${formatDate(endDate, 'MMM dd, yyyy')} (${duration} days)`
}

/**
 * Get ISO string for date input
 */
export function toISOString(date: Date): string {
  return date.toISOString()
}

/**
 * Parse ISO string to Date
 */
export function fromISOString(isoString: string): Date {
  return parseISO(isoString)
}
