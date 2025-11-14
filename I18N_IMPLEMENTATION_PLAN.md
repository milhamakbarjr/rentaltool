# i18n Implementation Plan - Indonesian Locale (Rupiah Currency)

**Goal:** Implement internationalization with Indonesian as the default locale, using Rupiah (IDR) currency throughout the application.

**Status:** Planning Phase
**Date:** November 13, 2025

---

## 1. Current State Analysis

### Locale-Specific Code Identified

#### Currency
- **Current Default:** SGD (Singapore Dollar)
- **Current Locale:** `en-SG`
- **Usage:** 30+ instances across the codebase
- **Files:**
  - `src/lib/utils.ts` - `formatCurrency()` function
  - `src/utils/constants.ts` - `DEFAULT_CURRENCY = 'SGD'`
  - All feature components (inventory, customers, rentals, analytics)

#### Date Formatting
- **Current Format:** `MMM dd, yyyy` (US-style)
- **Library:** date-fns
- **Files:**
  - `src/utils/date.ts` - All date formatting functions
  - Components use `.toLocaleDateString()` without locale

#### Phone Number
- **Current Format:** Singapore (+65) format
- **File:** `src/lib/utils.ts` - `formatPhoneNumber()` function

#### Timezone
- **Current Default:** `Asia/Singapore`
- **Storage:** User profiles table
- **File:** `src/utils/constants.ts` - `DEFAULT_TIMEZONE`

---

## 2. Implementation Strategy

### Option A: Full i18n Library (next-intl) ⭐ **RECOMMENDED**

**Pros:**
- Professional, battle-tested solution
- Built for Next.js App Router
- Type-safe translations
- Server-side rendering support
- Easy to add more languages later
- Locale-aware formatting (numbers, dates, currency)
- Pluralization support

**Cons:**
- Additional dependency
- Initial setup time
- Learning curve

**Best for:** Professional application with potential for multi-language support

### Option B: Custom Locale Configuration (Lightweight)

**Pros:**
- No additional dependencies
- Simpler for single-language apps
- Direct control over formatting

**Cons:**
- More manual work for translations
- Hard to scale to multiple languages
- Need to manually implement locale formatting

**Best for:** Simple apps with only one language

### ✅ **DECISION: Use next-intl**

Indonesian businesses often require English for international clients, so having proper i18n foundation is valuable for future expansion.

---

## 3. Locale Configuration

### Primary Locale: Indonesian (id-ID)
```typescript
{
  locale: 'id-ID',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',  // WIB (UTC+7)
  dateFormat: 'dd/MM/yyyy',
  numberFormat: '.',  // Decimal separator
  currencyDisplay: 'symbol',  // Show 'Rp' instead of 'IDR'
}
```

### Secondary Locale: English (en-ID)
For Indonesian businesses serving international clients:
```typescript
{
  locale: 'en-ID',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
  dateFormat: 'dd/MM/yyyy',
  numberFormat: '.',
  currencyDisplay: 'symbol',
}
```

### Indonesian Number Formatting
- **Currency:** Rp 1.000.000 (dot as thousand separator)
- **Decimals:** Rp 1.000.000,50 (comma as decimal separator)
- **Date:** 13/11/2025 (DD/MM/YYYY)
- **Time:** 14:30 (24-hour format)

---

## 4. UX Design for Locale/Language Settings

### A. User Profile Settings (Primary Method) ⭐

**Location:** `/dashboard/settings` or User Profile Menu

**UI Design:**
```
┌─────────────────────────────────────────┐
│ Settings                                │
├─────────────────────────────────────────┤
│                                         │
│ Regional Settings                       │
│                                         │
│ Language                               │
│ [Indonesian ▼]                          │
│  ├─ Indonesian (Bahasa Indonesia)      │
│  └─ English                            │
│                                         │
│ Currency                               │
│ [IDR - Rupiah ▼]                       │
│  ├─ IDR - Indonesian Rupiah (Rp)      │
│  ├─ USD - US Dollar ($)               │
│  └─ SGD - Singapore Dollar (S$)       │
│                                         │
│ Timezone                               │
│ [Asia/Jakarta (WIB) ▼]                 │
│  ├─ Asia/Jakarta (WIB/UTC+7)          │
│  ├─ Asia/Makassar (WITA/UTC+8)        │
│  └─ Asia/Jayapura (WIT/UTC+9)         │
│                                         │
│ Date Format                            │
│ [DD/MM/YYYY ▼]                         │
│  ├─ DD/MM/YYYY (13/11/2025)           │
│  ├─ MM/DD/YYYY (11/13/2025)           │
│  └─ YYYY-MM-DD (2025-11-13)           │
│                                         │
│         [Save Settings]                │
└─────────────────────────────────────────┘
```

**Behavior:**
- Settings saved to user profile in database
- Applied across all sessions and devices
- Immediately updates all currency/date displays

### B. Quick Language Switcher (Optional) 🌐

**Location:** Top navigation bar (next to user profile)

**UI Design:**
```
┌──────────────────────────────────────────────────┐
│  RentalTool    🏠 Dashboard  📦 Inventory  👤 John  [ID ▼] │
│                                                    │
│  When clicked:                                     │
│  ┌──────────────────┐                            │
│  │ 🇮🇩 Indonesian   │                            │
│  │ 🇬🇧 English       │                            │
│  └──────────────────┘                            │
└──────────────────────────────────────────────────┘
```

**Behavior:**
- Quick switch between languages
- Does NOT change currency/timezone
- Only changes UI text translations

### C. During Onboarding/Registration 🎯

**Location:** Registration page after account creation

**UI Design:**
```
┌─────────────────────────────────────────┐
│ Welcome to RentalTool! 🎉               │
├─────────────────────────────────────────┤
│                                         │
│ Let's set up your preferences           │
│                                         │
│ Where are you located?                  │
│ [🇮🇩 Indonesia ▼]                       │
│                                         │
│ This will set your:                     │
│ • Currency: Indonesian Rupiah (Rp)     │
│ • Timezone: WIB (UTC+7)                │
│ • Date format: DD/MM/YYYY              │
│ • Language: Bahasa Indonesia           │
│                                         │
│ You can change these later in Settings  │
│                                         │
│         [Continue →]                    │
└─────────────────────────────────────────┘
```

**Behavior:**
- One-time setup during registration
- Smart defaults based on location
- Can be skipped (uses Indonesian defaults)

### ✅ **RECOMMENDED UX APPROACH:**

1. **Default to Indonesian** for all new users
2. **Onboarding step** to confirm locale preferences
3. **Settings page** for detailed customization
4. **Optional quick switcher** for bilingual users
5. **Browser detection** as fallback (check `navigator.language`)

---

## 5. Implementation Roadmap

### Phase 1: Setup & Configuration (1-2 hours)

#### Step 1.1: Install Dependencies
```bash
npm install next-intl
npm install --save-dev @formatjs/intl-localematcher
```

#### Step 1.2: Create Locale Configuration
**File:** `src/i18n/config.ts`
```typescript
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
  },
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    currency: 'IDR',  // Still use IDR for Indonesia-based business
    currencySymbol: 'Rp',
    timezone: 'Asia/Jakarta',
    dateFormat: 'dd/MM/yyyy',
  },
} as const
```

#### Step 1.3: Create i18n Request Handler
**File:** `src/i18n/request.ts`
```typescript
import { getRequestConfig } from 'next-intl/server'
import { getUserLocale } from './locale'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
```

#### Step 1.4: Update Next.js Configuration
**File:** `next.config.js`
```javascript
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')

module.exports = withNextIntl({
  // ... existing config
})
```

### Phase 2: Translation Files (2-3 hours)

#### Step 2.1: Create Translation Structure
```
src/i18n/messages/
├── id.json    # Indonesian translations
└── en.json    # English translations
```

#### Step 2.2: Indonesian Translation File
**File:** `src/i18n/messages/id.json`
```json
{
  "common": {
    "loading": "Memuat...",
    "save": "Simpan",
    "cancel": "Batal",
    "delete": "Hapus",
    "edit": "Edit",
    "add": "Tambah",
    "search": "Cari...",
    "filter": "Filter",
    "sort": "Urutkan"
  },
  "auth": {
    "login": "Masuk",
    "register": "Daftar",
    "logout": "Keluar",
    "email": "Email",
    "password": "Kata Sandi",
    "forgotPassword": "Lupa Kata Sandi?",
    "signInButton": "Masuk",
    "signUpButton": "Daftar Akun"
  },
  "navigation": {
    "dashboard": "Dasbor",
    "inventory": "Inventori",
    "customers": "Pelanggan",
    "rentals": "Penyewaan",
    "analytics": "Analitik",
    "payments": "Pembayaran",
    "settings": "Pengaturan"
  },
  "dashboard": {
    "welcome": "Selamat datang, {name}!",
    "totalRevenue": "Total Pendapatan",
    "activeRentals": "Penyewaan Aktif",
    "totalCustomers": "Total Pelanggan",
    "availableItems": "Barang Tersedia"
  },
  "inventory": {
    "title": "Inventori",
    "addItem": "Tambah Barang",
    "itemName": "Nama Barang",
    "category": "Kategori",
    "quantity": "Jumlah",
    "condition": "Kondisi",
    "pricing": "Harga",
    "hourlyRate": "Harga per Jam",
    "dailyRate": "Harga per Hari",
    "weeklyRate": "Harga per Minggu",
    "monthlyRate": "Harga per Bulan"
  },
  "customers": {
    "title": "Pelanggan",
    "addCustomer": "Tambah Pelanggan",
    "customerName": "Nama Pelanggan",
    "email": "Email",
    "phone": "Telepon",
    "address": "Alamat",
    "notes": "Catatan",
    "rentalHistory": "Riwayat Penyewaan"
  },
  "rentals": {
    "title": "Penyewaan",
    "newRental": "Penyewaan Baru",
    "rentalNumber": "Nomor Penyewaan",
    "customer": "Pelanggan",
    "startDate": "Tanggal Mulai",
    "endDate": "Tanggal Selesai",
    "returnDate": "Tanggal Kembali",
    "status": "Status",
    "totalAmount": "Total Biaya",
    "deposit": "Deposit",
    "processReturn": "Proses Pengembalian"
  },
  "validation": {
    "required": "Field ini wajib diisi",
    "emailInvalid": "Email tidak valid",
    "phoneInvalid": "Nomor telepon tidak valid",
    "minLength": "Minimal {min} karakter",
    "maxLength": "Maksimal {max} karakter",
    "dateInvalid": "Tanggal tidak valid"
  },
  "currency": {
    "format": "Rp {amount}"
  }
}
```

### Phase 3: Update Utility Functions (30 minutes)

#### Step 3.1: Update Currency Formatter
**File:** `src/lib/utils.ts`
```typescript
import { useLocale, useFormatter } from 'next-intl'

/**
 * Format number as currency with locale awareness
 */
export function formatCurrency(amount: number, currency?: string): string {
  const formatter = useFormatter()
  return formatter.number(amount, {
    style: 'currency',
    currency: currency || 'IDR',
  })
}

/**
 * Server-side currency formatter
 */
export function formatCurrencyServer(
  amount: number,
  locale: string = 'id-ID',
  currency: string = 'IDR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}
```

#### Step 3.2: Update Date Formatter
**File:** `src/utils/date.ts`
```typescript
import { format as dateFnsFormat } from 'date-fns'
import { id as localeId, enUS as localeEn } from 'date-fns/locale'

const localeMap = {
  id: localeId,
  en: localeEn,
}

/**
 * Format date with locale awareness
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'dd/MM/yyyy',
  locale: string = 'id'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const dateFnsLocale = localeMap[locale as keyof typeof localeMap] || localeId

  return dateFnsFormat(dateObj, formatStr, { locale: dateFnsLocale })
}
```

### Phase 4: Update Components (3-4 hours)

#### Step 4.1: Wrap Root Layout with Provider
**File:** `src/app/layout.tsx`
```typescript
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

#### Step 4.2: Update Navigation with Translations
**File:** `src/app/(dashboard)/layout.tsx`
```typescript
import { useTranslations } from 'next-intl'

export function DashboardNav() {
  const t = useTranslations('navigation')

  return (
    <nav>
      <Link href="/dashboard">{t('dashboard')}</Link>
      <Link href="/inventory">{t('inventory')}</Link>
      <Link href="/customers">{t('customers')}</Link>
      <Link href="/rentals">{t('rentals')}</Link>
    </nav>
  )
}
```

#### Step 4.3: Update Feature Components
**Example:** Inventory List
```typescript
import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'

export function InventoryList() {
  const t = useTranslations('inventory')

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('addItem')}</button>
      {/* ... rest of component */}
    </div>
  )
}
```

### Phase 5: Create Settings UI (2 hours)

#### Step 5.1: Create Settings Page
**File:** `src/app/(dashboard)/settings/page.tsx`
```typescript
import { requireAuth, getUserProfile } from '@/lib/auth/guards'
import { LocaleSettings } from '@/features/settings/components/locale-settings'

export default async function SettingsPage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  return (
    <div>
      <h1>Settings</h1>
      <LocaleSettings profile={profile} />
    </div>
  )
}
```

#### Step 5.2: Create Locale Settings Component
**File:** `src/features/settings/components/locale-settings.tsx`
```typescript
'use client'

import { useTransition } from 'react'
import { setUserLocale } from '@/i18n/locale'

export function LocaleSettings({ profile }) {
  const [isPending, startTransition] = useTransition()

  function onChange(value: string) {
    const locale = value as Locale
    startTransition(() => {
      setUserLocale(locale)
    })
  }

  return (
    <div>
      <label>Language</label>
      <select onChange={(e) => onChange(e.target.value)} disabled={isPending}>
        <option value="id">🇮🇩 Indonesian</option>
        <option value="en">🇬🇧 English</option>
      </select>
    </div>
  )
}
```

### Phase 6: Update Database (15 minutes)

#### Step 6.1: Update Profile Defaults
**File:** `supabase/migrations/20251113000003_update_locale_defaults.sql`
```sql
-- Update default currency to IDR
ALTER TABLE public.profiles
  ALTER COLUMN currency SET DEFAULT 'IDR';

-- Update default timezone to Jakarta
ALTER TABLE public.profiles
  ALTER COLUMN timezone SET DEFAULT 'Asia/Jakarta';

-- Add locale column
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'id' CHECK (locale IN ('id', 'en'));

-- Update existing profiles to Indonesian locale
UPDATE public.profiles
SET locale = 'id', currency = 'IDR', timezone = 'Asia/Jakarta'
WHERE locale IS NULL;
```

### Phase 7: Update Constants (5 minutes)

#### Step 7.1: Update Default Values
**File:** `src/utils/constants.ts`
```typescript
// Currency
export const DEFAULT_CURRENCY = 'IDR'
export const SUPPORTED_CURRENCIES = ['IDR', 'USD', 'SGD', 'EUR', 'GBP', 'AUD']

// Timezones (Indonesia has 3 time zones)
export const DEFAULT_TIMEZONE = 'Asia/Jakarta'  // WIB (UTC+7)
export const SUPPORTED_TIMEZONES = [
  'Asia/Jakarta',    // WIB - Western Indonesia (UTC+7)
  'Asia/Makassar',   // WITA - Central Indonesia (UTC+8)
  'Asia/Jayapura',   // WIT - Eastern Indonesia (UTC+9)
]

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy'  // Indonesian format
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm'
export const TIME_FORMAT = 'HH:mm'

// Locale
export const DEFAULT_LOCALE = 'id-ID'
export const SUPPORTED_LOCALES = ['id-ID', 'en-ID']
```

---

## 6. Testing Checklist

### Currency Display ✅
- [ ] All prices show "Rp" prefix
- [ ] Numbers formatted with dot as thousand separator (e.g., Rp 1.000.000)
- [ ] Decimals use comma (e.g., Rp 1.000,50)
- [ ] Currency in forms accepts Indonesian format
- [ ] Analytics charts show correct currency

### Date Formatting ✅
- [ ] All dates show DD/MM/YYYY format
- [ ] Date pickers accept DD/MM/YYYY input
- [ ] Relative dates in Indonesian ("2 jam yang lalu")
- [ ] Calendar components use Indonesian month names
- [ ] Timezone calculations use Asia/Jakarta

### Translations ✅
- [ ] Navigation menu in Indonesian
- [ ] Form labels in Indonesian
- [ ] Button text in Indonesian
- [ ] Error messages in Indonesian
- [ ] Validation messages in Indonesian
- [ ] Empty states in Indonesian

### User Settings ✅
- [ ] Can change language in settings
- [ ] Language preference saved to profile
- [ ] Language persists across sessions
- [ ] Quick switcher updates immediately (if implemented)

### Onboarding ✅
- [ ] New users see Indonesian by default
- [ ] Location-based defaults work
- [ ] Settings can be changed during onboarding
- [ ] Skip option defaults to Indonesian

---

## 7. Rollout Strategy

### Phase 1: Backend & Core (Week 1)
1. Install next-intl
2. Setup configuration
3. Update utility functions
4. Update constants and database defaults

### Phase 2: Translations (Week 1-2)
1. Create Indonesian translation files
2. Create English translation files
3. Update all component text

### Phase 3: UI Components (Week 2)
1. Update all feature components
2. Add settings page
3. Add language switcher (optional)

### Phase 4: Testing (Week 2-3)
1. Test all currency displays
2. Test all date formats
3. Test translations
4. User acceptance testing

### Phase 5: Deployment (Week 3)
1. Deploy to staging
2. Final testing
3. Deploy to production
4. Monitor for issues

---

## 8. Estimated Effort

| Task | Time | Complexity |
|------|------|------------|
| Setup & Configuration | 1-2 hours | Medium |
| Create Translation Files | 2-3 hours | Low |
| Update Utility Functions | 30 min | Low |
| Update Components | 3-4 hours | Medium |
| Create Settings UI | 2 hours | Medium |
| Database Migration | 15 min | Low |
| Testing | 2-3 hours | Medium |
| **Total** | **11-15 hours** | **Medium** |

---

## 9. Benefits After Implementation

✅ **Professional Indonesian UX**
- Native language support for local users
- Proper currency formatting (Rupiah)
- Indonesian date/time formats
- Better user experience for target market

✅ **Scalability**
- Easy to add more languages (English, etc.)
- Structured translation management
- Consistent formatting across app

✅ **Business Value**
- Appeal to Indonesian market
- Support for international clients (English)
- Professional presentation

✅ **Developer Experience**
- Type-safe translations
- Centralized text management
- Easy to maintain and update

---

## 10. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing functionality | High | Comprehensive testing before deploy |
| Incomplete translations | Medium | Start with essential pages, expand gradually |
| Performance impact | Low | next-intl is optimized for performance |
| User confusion after update | Medium | Clear communication, changelog, help docs |
| Database migration issues | Medium | Test migration on staging first |

---

## 11. Next Steps

### Immediate Actions:
1. **Review and approve this plan** with stakeholders
2. **Decide on UX approach** (settings page, onboarding, quick switcher)
3. **Prioritize languages** (Indonesian only, or Indonesian + English)
4. **Create translation spreadsheet** for non-technical team members
5. **Schedule implementation** (1-2 week sprint)

### Questions to Answer:
- [ ] Do we need English language support immediately?
- [ ] Should we add language switcher to navigation?
- [ ] Do we need onboarding locale selection?
- [ ] Who will provide Indonesian translations?
- [ ] What's the deployment timeline?

---

**Created by:** Claude (Sonnet 4.5)
**Status:** Ready for Review & Implementation
**Priority:** High (Core Business Requirement)
