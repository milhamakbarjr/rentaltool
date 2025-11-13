/**
 * Application Constants
 *
 * Global constants used throughout the application
 */

// App Configuration
export const APP_NAME = 'RentalTool'
export const APP_DESCRIPTION = 'Mobile-first rental management system'

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  RENTALS: '/rentals',
  CUSTOMERS: '/customers',
  INVENTORY: '/inventory',
  ANALYTICS: '/analytics',
  PAYMENTS: '/payments',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  AUTH_CALLBACK: '/auth/callback',
} as const

// Rental Statuses
export const RENTAL_STATUSES = {
  DRAFT: 'draft',
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue',
} as const

export const RENTAL_STATUS_LABELS: Record<string, string> = {
  [RENTAL_STATUSES.DRAFT]: 'Draft',
  [RENTAL_STATUSES.UPCOMING]: 'Upcoming',
  [RENTAL_STATUSES.ACTIVE]: 'Active',
  [RENTAL_STATUSES.COMPLETED]: 'Completed',
  [RENTAL_STATUSES.CANCELLED]: 'Cancelled',
  [RENTAL_STATUSES.OVERDUE]: 'Overdue',
}

export const RENTAL_STATUS_COLORS: Record<string, string> = {
  [RENTAL_STATUSES.DRAFT]: 'gray',
  [RENTAL_STATUSES.UPCOMING]: 'blue',
  [RENTAL_STATUSES.ACTIVE]: 'green',
  [RENTAL_STATUSES.COMPLETED]: 'gray',
  [RENTAL_STATUSES.CANCELLED]: 'red',
  [RENTAL_STATUSES.OVERDUE]: 'red',
}

// Payment Statuses
export const PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
} as const

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  [PAYMENT_STATUSES.UNPAID]: 'Unpaid',
  [PAYMENT_STATUSES.PARTIAL]: 'Partially Paid',
  [PAYMENT_STATUSES.PAID]: 'Paid',
}

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer',
  OTHER: 'other',
} as const

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  [PAYMENT_METHODS.CASH]: 'Cash',
  [PAYMENT_METHODS.CARD]: 'Card',
  [PAYMENT_METHODS.TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHODS.OTHER]: 'Other',
}

// Item Conditions
export const ITEM_CONDITIONS = {
  NEW: 'new',
  GOOD: 'good',
  FAIR: 'fair',
  NEEDS_REPAIR: 'needs_repair',
  DAMAGED: 'damaged',
  MISSING: 'missing',
} as const

export const ITEM_CONDITION_LABELS: Record<string, string> = {
  [ITEM_CONDITIONS.NEW]: 'New',
  [ITEM_CONDITIONS.GOOD]: 'Good',
  [ITEM_CONDITIONS.FAIR]: 'Fair',
  [ITEM_CONDITIONS.NEEDS_REPAIR]: 'Needs Repair',
  [ITEM_CONDITIONS.DAMAGED]: 'Damaged',
  [ITEM_CONDITIONS.MISSING]: 'Missing',
}

// Rate Types
export const RATE_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const

export const RATE_TYPE_LABELS: Record<string, string> = {
  [RATE_TYPES.HOURLY]: 'Hourly',
  [RATE_TYPES.DAILY]: 'Daily',
  [RATE_TYPES.WEEKLY]: 'Weekly',
  [RATE_TYPES.MONTHLY]: 'Monthly',
}

// Customer Types
export const CUSTOMER_TYPES = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
} as const

export const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  [CUSTOMER_TYPES.INDIVIDUAL]: 'Individual',
  [CUSTOMER_TYPES.BUSINESS]: 'Business',
}

// File Upload Limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES]

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy'
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm'
export const TIME_FORMAT = 'HH:mm'

// Currency
export const DEFAULT_CURRENCY = 'SGD'
export const SUPPORTED_CURRENCIES = ['SGD', 'USD', 'EUR', 'GBP', 'AUD']

// Timezones
export const DEFAULT_TIMEZONE = 'Asia/Singapore'

// Query Keys (for TanStack Query)
export const QUERY_KEYS = {
  RENTALS: 'rentals',
  RENTAL: 'rental',
  CUSTOMERS: 'customers',
  CUSTOMER: 'customer',
  INVENTORY: 'inventory',
  INVENTORY_ITEM: 'inventory-item',
  CATEGORIES: 'categories',
  PAYMENTS: 'payments',
  ANALYTICS: 'analytics',
  PROFILE: 'profile',
} as const

// Storage Buckets
export const STORAGE_BUCKETS = {
  ITEM_IMAGES: 'item-images',
  CONDITION_PHOTOS: 'condition-photos',
  RECEIPTS: 'receipts',
} as const
