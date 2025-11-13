# Supabase Database Schema

This directory contains the database schema and migrations for RentalTool.

## Overview

The schema is designed with:
- **Multi-user support** via Row Level Security (RLS)
- **Referential integrity** with proper foreign keys
- **Performance optimization** with strategic indexes
- **Automatic updates** via triggers
- **Business logic** in database functions

## Schema Structure

### Core Tables

1. **profiles** - User profiles (extends Supabase auth.users)
2. **categories** - Inventory categories
3. **inventory_items** - Rental items with pricing and availability
4. **customers** - Customer database with reliability tracking
5. **rentals** - Rental transactions
6. **rental_items** - Items in each rental (many-to-many)
7. **payments** - Payment records
8. **expenses** - Business expenses (Phase 2)

### Storage Buckets

1. **item-images** (public) - Product photos
2. **condition-photos** (private) - Pickup/return condition photos
3. **receipts** (private) - Payment receipts and documents

## Setup Instructions

### Option 1: Manual Setup (Supabase Dashboard)

1. **Create a new Supabase project:**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose **Asia Pacific (Singapore)** region
   - Set project name: `rentaltool` (or your choice)
   - Set a strong database password
   - Wait for project to be ready (~2 minutes)

2. **Run migrations:**
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `migrations/20251113000001_initial_schema.sql`
   - Paste and run
   - Copy contents of `migrations/20251113000002_storage_policies.sql`
   - Paste and run

3. **Verify setup:**
   - Go to Table Editor - you should see all tables
   - Go to Authentication > Policies - RLS should be enabled
   - Go to Storage - buckets should be created

### Option 2: Supabase CLI (Recommended for version control)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link to your project:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Get YOUR_PROJECT_REF from project settings)

4. **Apply migrations:**
   ```bash
   supabase db push
   ```

5. **Generate TypeScript types:**
   ```bash
   supabase gen types typescript --local > src/types/supabase.ts
   ```

## Database Functions

### `generate_rental_number(user_id)`
Generates unique rental numbers in format: `RENT-20251113-0001`

**Usage:**
```sql
SELECT generate_rental_number('user-uuid-here');
```

### `check_item_availability(item_id, start_date, end_date, exclude_rental_id)`
Checks if an item is available for a date range.

**Usage:**
```sql
SELECT * FROM check_item_availability(
  'item-uuid',
  '2025-11-15 10:00:00'::timestamptz,
  '2025-11-20 10:00:00'::timestamptz,
  NULL
);
-- Returns: available_quantity, booked_quantity
```

### `calculate_customer_reliability_score(customer_id)`
Calculates reliability score (0-100) based on rental history.

**Usage:**
```sql
SELECT calculate_customer_reliability_score('customer-uuid');
```

### `update_rental_status()`
Updates rental statuses based on current date (upcoming → active → overdue).

**Usage (run via cron or manually):**
```sql
SELECT update_rental_status();
```

## Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow users to **only access their own data**
- Prevent cross-user data leakage
- Enable future multi-user/team features

**Example Policy:**
```sql
CREATE POLICY "Users can view their own rentals"
  ON public.rentals FOR SELECT
  USING (auth.uid() = user_id);
```

## Indexes

Strategic indexes are created for:
- User-scoped queries (all tables have `user_id` index)
- Search operations (name, phone, email)
- Date range queries (rentals by date)
- Foreign key relationships

## Triggers

### Auto-updated Fields
- `updated_at` - Automatically set on all updates
- `rental_number` - Auto-generated on rental creation
- `reliability_score` - Auto-updated when rental is completed

## Views

### `rental_summary`
Complete rental information with customer and payment details.

**Usage:**
```sql
SELECT * FROM rental_summary
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### `inventory_utilization`
Inventory performance metrics including ROI.

**Usage:**
```sql
SELECT * FROM inventory_utilization
WHERE user_id = auth.uid()
ORDER BY total_revenue DESC;
```

## File Storage Structure

### item-images (Public)
```
item-images/
  {user_id}/
    {timestamp}-{uuid}.jpg
```

### condition-photos (Private)
```
condition-photos/
  {user_id}/
    {rental_id}/
      pickup-{timestamp}-{uuid}.jpg
      return-{timestamp}-{uuid}.jpg
```

### receipts (Private)
```
receipts/
  {user_id}/
    {rental_id}-{timestamp}.pdf
```

## TypeScript Integration

After running migrations, generate TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/supabase.ts
```

Then use in your code:

```typescript
import { Database } from '@/types/supabase'

export type Rental = Database['public']['Tables']['rentals']['Row']
export type RentalInsert = Database['public']['Tables']['rentals']['Insert']
export type RentalUpdate = Database['public']['Tables']['rentals']['Update']
```

## Testing the Schema

### 1. Create a test user
```sql
-- Via Supabase Auth UI or API
```

### 2. Insert a profile
```sql
INSERT INTO public.profiles (id, email, full_name, business_name)
VALUES (
  auth.uid(),
  'test@example.com',
  'Test User',
  'Test Rental Business'
);
```

### 3. Create a category
```sql
INSERT INTO public.categories (user_id, name, icon)
VALUES (auth.uid(), 'Tools', '🔧');
```

### 4. Add an inventory item
```sql
INSERT INTO public.inventory_items (
  user_id,
  name,
  description,
  quantity_total,
  pricing
)
VALUES (
  auth.uid(),
  'Power Drill',
  'Cordless power drill with battery',
  3,
  '{"daily": 50, "weekly": 300}'::jsonb
);
```

### 5. Create a customer
```sql
INSERT INTO public.customers (
  user_id,
  full_name,
  phone_number,
  email
)
VALUES (
  auth.uid(),
  'John Doe',
  '+65 9123 4567',
  'john@example.com'
);
```

### 6. Create a rental
```sql
INSERT INTO public.rentals (
  user_id,
  customer_id,
  start_date,
  end_date,
  total_amount,
  deposit_amount
)
VALUES (
  auth.uid(),
  'customer-uuid-here',
  NOW(),
  NOW() + INTERVAL '7 days',
  350,
  100
);
-- rental_number is auto-generated
```

## Backup & Recovery

### Manual Backup (Free Tier)
```bash
# Export all data to SQL
supabase db dump -f backup.sql

# Or export specific tables
pg_dump -h db.PROJECT_REF.supabase.co \
  -U postgres \
  -d postgres \
  -t public.rentals \
  -t public.customers \
  > backup.sql
```

### Restore from Backup
```bash
psql -h db.PROJECT_REF.supabase.co \
  -U postgres \
  -d postgres \
  -f backup.sql
```

## Performance Optimization Tips

1. **Use indexes for queries:**
   ```sql
   -- Good (uses index)
   SELECT * FROM rentals WHERE user_id = 'xxx' AND status = 'active';

   -- Bad (no index on random column)
   SELECT * FROM rentals WHERE notes LIKE '%search%';
   ```

2. **Use views for complex queries:**
   ```sql
   -- Instead of joining multiple times, use rental_summary view
   SELECT * FROM rental_summary WHERE user_id = auth.uid();
   ```

3. **Batch operations:**
   ```sql
   -- Insert multiple items in one query
   INSERT INTO inventory_items (user_id, name, ...) VALUES
     (auth.uid(), 'Item 1', ...),
     (auth.uid(), 'Item 2', ...),
     (auth.uid(), 'Item 3', ...);
   ```

## Monitoring

### Check table sizes
```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check slow queries
```sql
SELECT
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Migration Strategy

### Adding New Migrations

1. Create new migration file:
   ```bash
   supabase migration new add_feature_name
   ```

2. Write migration SQL in the new file

3. Test locally:
   ```bash
   supabase db reset --local
   ```

4. Apply to production:
   ```bash
   supabase db push
   ```

### Rolling Back

If you need to undo a migration, create a new migration that reverses the changes:

```sql
-- Example: Remove a column added in previous migration
ALTER TABLE inventory_items DROP COLUMN IF EXISTS new_column;
```

## Troubleshooting

### Issue: RLS policies blocking queries
**Solution:** Check that `auth.uid()` matches `user_id` in the table.

```sql
-- Debug: Check current user
SELECT auth.uid();

-- Debug: Check if data exists for user
SELECT * FROM rentals WHERE user_id = auth.uid();
```

### Issue: Foreign key constraint errors
**Solution:** Ensure referenced records exist before inserting.

```sql
-- Check if customer exists before creating rental
SELECT id FROM customers WHERE id = 'customer-uuid' AND user_id = auth.uid();
```

### Issue: Storage upload fails
**Solution:** Check bucket policies and folder structure.

```sql
-- File path should be: user_id/filename
-- Example: a1b2c3.../1234567890-uuid.jpg
```

## Security Best Practices

1. **Never expose database credentials** in client code
2. **Always use RLS policies** - never disable them
3. **Validate data in triggers** before insertion
4. **Use parameterized queries** via Supabase client
5. **Audit sensitive operations** via logging

## Support

- **Supabase Docs:** https://supabase.com/docs
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **Storage Guide:** https://supabase.com/docs/guides/storage

## Next Steps

After setting up the database:
1. Configure Supabase client in Next.js (`src/lib/supabase.ts`)
2. Generate TypeScript types
3. Create Zod schemas matching database schema
4. Build API queries using Supabase client
5. Test CRUD operations with RLS enabled
