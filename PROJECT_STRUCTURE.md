# RentalTool - Project Structure

This document outlines the folder structure and organization of the RentalTool codebase.

## Directory Structure

```
rentaltool/
├── docs/                          # Documentation
│   ├── PRD.md                     # Product Requirements Document
│   └── SETUP_GUIDE.md             # Setup instructions
│
├── supabase/                      # Supabase configuration
│   ├── migrations/                # Database migrations
│   │   ├── 20251113000001_initial_schema.sql
│   │   └── 20251113000002_storage_policies.sql
│   └── README.md                  # Supabase docs
│
├── src/                           # Source code
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth routes group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/           # Dashboard routes group (protected)
│   │   │   ├── dashboard/
│   │   │   ├── rentals/
│   │   │   ├── customers/
│   │   │   ├── inventory/
│   │   │   ├── analytics/
│   │   │   ├── payments/
│   │   │   └── settings/
│   │   ├── auth/
│   │   │   └── callback/          # OAuth callback
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   │
│   ├── components/                # React components
│   │   ├── ui/                    # Untitled UI components (reusable)
│   │   ├── forms/                 # Form components
│   │   ├── layout/                # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── mobile-nav.tsx
│   │   └── providers.tsx          # React providers wrapper
│   │
│   ├── features/                  # Feature-based modules
│   │   ├── rentals/               # Rental management feature
│   │   │   ├── components/        # Rental-specific components
│   │   │   ├── hooks/             # Rental-specific hooks
│   │   │   ├── schemas/           # Zod validation schemas
│   │   │   └── api.ts             # Rental API functions
│   │   ├── customers/             # Customer management
│   │   ├── inventory/             # Inventory management
│   │   ├── dashboard/             # Dashboard & overview
│   │   ├── analytics/             # Analytics & reporting
│   │   └── payments/              # Payment tracking
│   │
│   ├── hooks/                     # Global React hooks
│   │   ├── use-auth.ts            # Authentication hook
│   │   ├── use-user-profile.ts    # User profile hook
│   │   └── use-supabase.ts        # Supabase client hook
│   │
│   ├── lib/                       # Libraries & utilities
│   │   ├── supabase/              # Supabase clients
│   │   │   ├── client.ts          # Browser client
│   │   │   ├── server.ts          # Server client
│   │   │   └── middleware.ts      # Auth middleware
│   │   ├── auth/                  # Auth utilities
│   │   │   ├── auth.ts            # Auth functions
│   │   │   └── guards.ts          # Auth guards
│   │   ├── validations/           # Zod schemas
│   │   │   ├── auth.ts            # Auth schemas
│   │   │   ├── rental.ts          # Rental schemas
│   │   │   ├── customer.ts        # Customer schemas
│   │   │   └── inventory.ts       # Inventory schemas
│   │   └── utils.ts               # Generic utilities
│   │
│   ├── store/                     # Zustand stores
│   │   ├── index.ts               # Store exports
│   │   ├── use-ui-store.ts        # UI state (modals, sidebars)
│   │   ├── use-rental-store.ts    # Rental draft state
│   │   └── use-filter-store.ts    # Filter/search state
│   │
│   ├── types/                     # TypeScript types
│   │   ├── supabase.ts            # Supabase DB types
│   │   └── index.ts               # Global types
│   │
│   ├── utils/                     # Utility functions
│   │   ├── date.ts                # Date formatting
│   │   ├── currency.ts            # Currency formatting
│   │   ├── calculations.ts        # Business calculations
│   │   └── constants.ts           # App constants
│   │
│   └── middleware.ts              # Next.js middleware
│
├── public/                        # Static assets
│   ├── images/
│   └── icons/
│
├── .env.local.example             # Environment variables template
├── .gitignore
├── next.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Folder Conventions

### `/src/app`
Next.js 14 App Router directory. Uses route groups for organization:
- `(auth)` - Public authentication routes
- `(dashboard)` - Protected dashboard routes (requires auth)

### `/src/components`
Reusable UI components organized by type:
- `ui/` - Generic Untitled UI components
- `forms/` - Form components (inputs, selects, etc.)
- `layout/` - Layout components (header, sidebar, etc.)

### `/src/features`
Feature-based architecture. Each feature is self-contained:
- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks
- `schemas/` - Zod validation schemas
- `api.ts` - Supabase queries for the feature

**Example: `/src/features/rentals`**
```
rentals/
├── components/
│   ├── rental-form.tsx
│   ├── rental-list.tsx
│   └── rental-card.tsx
├── hooks/
│   ├── use-rentals.ts
│   └── use-create-rental.ts
├── schemas/
│   └── rental-schema.ts
└── api.ts
```

### `/src/hooks`
Global React hooks used across features:
- Custom hooks following `use-*` naming convention
- Reusable hooks for auth, data fetching, UI state

### `/src/lib`
Core libraries and utilities:
- **supabase/** - Supabase client configuration
- **auth/** - Authentication utilities and guards
- **validations/** - Zod schemas for validation
- **utils.ts** - Generic helper functions

### `/src/store`
Zustand stores for global state management:
- Each store is in its own file
- Follow `use-*-store.ts` naming convention

**When to use Zustand:**
- UI state (modals, sidebars, filters)
- Temporary form data (drafts)
- User preferences
- Client-side only state

**When NOT to use Zustand:**
- Server data (use TanStack Query instead)
- Persistent data (use Supabase directly)

### `/src/types`
TypeScript type definitions:
- **supabase.ts** - Auto-generated from database schema
- **index.ts** - Global types and interfaces

### `/src/utils`
Utility functions organized by domain:
- **date.ts** - Date formatting, timezone handling
- **currency.ts** - Currency formatting, conversions
- **calculations.ts** - Business logic calculations
- **constants.ts** - App-wide constants

## Naming Conventions

### Files
- **Components:** `kebab-case.tsx` (e.g., `rental-form.tsx`)
- **Hooks:** `use-feature-name.ts` (e.g., `use-rentals.ts`)
- **Utilities:** `kebab-case.ts` (e.g., `date-utils.ts`)
- **Types:** `kebab-case.ts` (e.g., `rental-types.ts`)

### Components
- **React Components:** `PascalCase` (e.g., `RentalForm`)
- **Props interfaces:** `ComponentNameProps` (e.g., `RentalFormProps`)

### Functions
- **Regular functions:** `camelCase` (e.g., `calculateTotal`)
- **Hooks:** `useCamelCase` (e.g., `useRentals`)
- **Event handlers:** `handleAction` (e.g., `handleSubmit`)

### Variables
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)
- **Regular variables:** `camelCase` (e.g., `totalAmount`)
- **Boolean variables:** `isState` or `hasState` (e.g., `isLoading`, `hasError`)

## Import Order

Follow this order for imports (enforced by ESLint):

```typescript
// 1. React and Next.js
import React from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 3. Absolute imports from src/
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// 4. Relative imports
import { RentalCard } from './rental-card'
import type { RentalProps } from './types'

// 5. Styles (if any)
import styles from './component.module.css'
```

## Code Organization Best Practices

### 1. Colocation
Keep related code close together:
```
features/rentals/
├── components/
│   └── rental-form.tsx        # Component
├── hooks/
│   └── use-create-rental.ts   # Hook for this component
└── schemas/
    └── rental-schema.ts       # Validation for this component
```

### 2. Single Responsibility
Each file should have a single, clear purpose:
- ✅ Good: `use-rentals.ts` - Fetches rental data
- ❌ Bad: `rental-utils.ts` - Does everything rental-related

### 3. Feature-based Structure
Group by feature, not by type:
- ✅ Good: `features/rentals/components/rental-form.tsx`
- ❌ Bad: `components/rentals/rental-form.tsx`

### 4. Avoid Deep Nesting
Keep folder structure flat when possible:
- ✅ Good: `features/rentals/rental-form.tsx`
- ❌ Bad: `features/rentals/forms/create/rental-form.tsx`

## Adding New Features

To add a new feature:

1. **Create feature folder:**
   ```bash
   mkdir -p src/features/new-feature/{components,hooks,schemas}
   touch src/features/new-feature/api.ts
   ```

2. **Create Zod schema:**
   ```typescript
   // src/features/new-feature/schemas/new-feature-schema.ts
   import { z } from 'zod'

   export const newFeatureSchema = z.object({
     // Define schema
   })
   ```

3. **Create API functions:**
   ```typescript
   // src/features/new-feature/api.ts
   import { createClient } from '@/lib/supabase/client'

   export async function getNewFeature() {
     const supabase = createClient()
     // Implement query
   }
   ```

4. **Create hooks:**
   ```typescript
   // src/features/new-feature/hooks/use-new-feature.ts
   import { useQuery } from '@tanstack/react-query'
   import { getNewFeature } from '../api'

   export function useNewFeature() {
     return useQuery({
       queryKey: ['new-feature'],
       queryFn: getNewFeature,
     })
   }
   ```

5. **Create components:**
   ```typescript
   // src/features/new-feature/components/new-feature.tsx
   import { useNewFeature } from '../hooks/use-new-feature'

   export function NewFeature() {
     // Implement component
   }
   ```

## Environment Variables

Store in `.env.local` (never commit this file):

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional
SUPABASE_SERVICE_ROLE_KEY=  # Server-side only
NEXT_PUBLIC_APP_URL=
```

## Scripts

```bash
# Development
bun dev              # Start dev server with Turbopack
bun build            # Build for production
bun start            # Start production server

# Code Quality
bun lint             # Run ESLint
bun format           # Format with Prettier
bun type-check       # TypeScript type checking

# Database
supabase db push     # Push migrations
supabase gen types   # Generate TypeScript types
```

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/)
