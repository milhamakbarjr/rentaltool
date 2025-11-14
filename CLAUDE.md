# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RentalTool is a modern rental management platform built with Next.js 15 App Router, React 19, TypeScript, Supabase, and TailwindCSS v4. It uses a feature-based modular architecture with strict type safety.

## Development Commands

```bash
# Development
bun run dev              # Start dev server with Turbopack on localhost:3000
bun run build            # Production build
bun run start            # Start production server

# Code Quality
bun run lint             # Run ESLint
bun run type-check       # TypeScript type checking (run before commits)
bun run format           # Format code with Prettier
bun run format:check     # Check formatting without changes
```

## Architecture

### Feature-Based Module Structure

Features are self-contained modules in `src/features/{feature-name}/`:

```
features/{feature}/
├── api.ts              # Supabase queries (server-side functions)
├── components/         # Feature-specific UI components
│   ├── {feature}-list.tsx
│   ├── {feature}-form.tsx
│   └── {feature}-detail.tsx
├── hooks/              # React Query hooks wrapping API calls
│   └── use-{feature}.ts
└── schemas/            # Zod validation schemas
    └── {feature}-schema.ts
```

**Current features**: `analytics`, `customers`, `inventory`, `payments`, `rentals`, `settings`

### Component Organization

Components follow atomic design with increasing complexity:

- `components/foundations/` - Design primitives (icons, logos, patterns)
- `components/base/` - Basic UI elements (buttons, inputs, forms)
- `components/application/` - Complex widgets (tables, modals, navigation)
- `components/marketing/` - Landing page components
- `components/ui/` - Untitled UI shared components

### Data Flow Pattern

```
Page (Server Component)
  ↓
Feature Component (Client Component)
  ↓
Custom Hook (React Query)
  ↓
API Function (api.ts)
  ↓
Supabase Client
```

### State Management

- **Server State**: TanStack Query (React Query v5) for all data fetching/mutations
- **Global UI State**: Zustand (`src/store/use-ui-store.ts`) for sidebar, modals, loading states
- **Local State**: React hooks + react-hook-form for forms

### Supabase Integration

**Dual client pattern**:
- `lib/supabase/client.ts` - Browser client for Client Components
- `lib/supabase/server.ts` - Server client for Server Components/API Routes
- `lib/supabase/middleware.ts` - Session refresh middleware

**Database types**: Auto-generated in `src/types/supabase.ts` - DO NOT manually edit

### Authentication Flow

1. Middleware (`src/middleware.ts`) refreshes session on every request
2. Route protection via guards (`lib/auth/guards.ts`):
   - `requireAuth()` - Protects dashboard routes, redirects to `/login`
   - `requireGuest()` - Protects auth pages, redirects to `/dashboard`
3. Client-side auth state via `useAuth()` hook

### App Router Structure

**Route groups**:
- `app/(auth)/` - Login, register, reset password (centered layout)
- `app/(dashboard)/` - Protected dashboard routes (sidebar + navigation)

**Route pattern** for CRUD:
- `/dashboard/{feature}` - List view
- `/dashboard/{feature}/new` - Create form
- `/dashboard/{feature}/[id]` - Detail/edit view

## Key Patterns & Guidelines

### Adding a New Feature

1. Create feature module: `src/features/{feature}/`
2. Define Zod schema in `schemas/{feature}-schema.ts`
3. Create API functions in `api.ts` using Supabase client
4. Wrap API with React Query hooks in `hooks/use-{feature}.ts`
5. Build components in `components/`
6. Add route in `app/(dashboard)/{feature}/`

### Form Pattern

Use `react-hook-form` + `@hookform/resolvers/zod`:

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(featureSchema),
  defaultValues: { ... }
})

const mutation = useCreateFeature()

function onSubmit(data: FormData) {
  mutation.mutate(data, {
    onSuccess: () => router.push('/dashboard/feature')
  })
}
```

### React Query Configuration

Configured in `src/components/providers.tsx`:
- `staleTime: 60000` (1 minute)
- `gcTime: 300000` (5 minutes)
- `refetchOnWindowFocus: false`
- `retry: 1`

Always use query invalidation after mutations to refresh data.

### TypeScript Paths

Use `@/` alias for imports: `import { ... } from '@/components/...'`

### Server vs Client Components

- **Server Components** (default): Use for layouts, auth guards, static content
- **Client Components** (`'use client'`): Required for hooks, event handlers, browser APIs
- Fetch data in Server Components when possible; use React Query in Client Components

### Styling

- TailwindCSS v4 configured in `src/styles/globals.css`
- Use `cn()` utility from `@/lib/utils` to merge class names
- Follow existing Untitled UI component patterns for consistency. It is forbidden to create custom component without checking the existing Untitled UI component. 

### Internationalization

Uses `next-intl` with English (`en`) and Indonesian (`id`) locales:
- Messages in `src/i18n/messages/{locale}.json`
- Access via `useTranslations()` hook in Client Components
- Use `await getTranslations()` in Server Components

## Important Files

**Configuration**:
- `tsconfig.json` - TypeScript config with strict mode, `@/` path alias
- `next.config.mjs` - Next.js config with next-intl plugin
- `src/middleware.ts` - Session refresh on every request

**Core Infrastructure**:
- `src/lib/supabase/` - Supabase client configuration
- `src/lib/auth/guards.ts` - Route protection utilities
- `src/types/supabase.ts` - Auto-generated database types
- `src/components/providers.tsx` - React Query provider setup

**Utilities**:
- `src/lib/utils.ts` - Common utilities (`formatCurrency`, `cn`, `formatDate`)
- `src/utils/constants.ts` - App-wide constants

## Database Schema

Key tables (see `src/types/supabase.ts` for full schema):
- `profiles` - User profiles
- `categories` - Item categories
- `inventory_items` - Rental inventory
- `customers` - Customer records
- `rentals` - Rental transactions
- `rental_items` - Rental line items
- `payments` - Payment records
- `expenses` - Expense tracking

Views: `rental_summary`, `inventory_utilization`

Functions: `generate_rental_number()`, `check_item_availability()`, `calculate_customer_reliability_score()`, `update_rental_status()`

## Testing & Type Safety

Always run before committing:
```bash
bun run type-check    # Verify TypeScript compilation
bun run lint          # Check code quality
```

## Common Gotchas

1. **Supabase client**: Use browser client in Client Components, server client in Server Components
2. **Query keys**: Use feature-specific query keys from hooks for proper cache invalidation
3. **Route protection**: Apply `requireAuth()` or `requireGuest()` in layout.tsx, not page.tsx
4. **Zod schemas**: Define both validation and TypeScript types using `z.infer<typeof schema>`
5. **React Query**: Always invalidate queries after mutations to keep UI in sync
