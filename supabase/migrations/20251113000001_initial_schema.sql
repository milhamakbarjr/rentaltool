-- RentalTool Initial Database Schema
-- Migration: 20251113000001_initial_schema
-- Description: Create all core tables, RLS policies, indexes, and functions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- TABLES
-- ==============================================

-- Users table (extends Supabase auth.users)
-- Note: Supabase Auth manages the auth.users table
-- This table stores additional business-specific user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  business_name TEXT,
  phone_number TEXT,
  timezone TEXT DEFAULT 'Asia/Singapore',
  currency TEXT DEFAULT 'SGD',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, name)
);

-- Inventory items table
CREATE TABLE public.inventory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity_total INTEGER DEFAULT 1 NOT NULL CHECK (quantity_total >= 0),
  condition TEXT DEFAULT 'good' CHECK (condition IN ('new', 'good', 'fair', 'needs_repair')),
  purchase_cost DECIMAL(10, 2),
  purchase_date DATE,
  -- Pricing stored as JSON for flexibility
  pricing JSONB DEFAULT '{"hourly": null, "daily": null, "weekly": null, "monthly": null}'::jsonb,
  deposit_required DECIMAL(10, 2) DEFAULT 0,
  minimum_rental_period INTEGER DEFAULT 1, -- in hours
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  specifications JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'retired')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Customers table
CREATE TABLE public.customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  address TEXT,
  id_number TEXT,
  customer_type TEXT DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  reliability_score INTEGER DEFAULT 100 CHECK (reliability_score >= 0 AND reliability_score <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Rentals table
CREATE TABLE public.rentals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT NOT NULL,
  rental_number TEXT NOT NULL, -- Auto-generated: RENT-YYYYMMDD-XXXX
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'active', 'completed', 'cancelled', 'overdue')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  actual_return_date TIMESTAMPTZ,
  total_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  deposit_amount DECIMAL(10, 2) DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  delivery_required BOOLEAN DEFAULT false,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, rental_number),
  CHECK (end_date > start_date)
);

-- Rental items (many-to-many relationship between rentals and inventory)
CREATE TABLE public.rental_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rental_id UUID REFERENCES public.rentals(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.inventory_items(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
  rate DECIMAL(10, 2) NOT NULL,
  rate_type TEXT DEFAULT 'daily' CHECK (rate_type IN ('hourly', 'daily', 'weekly', 'monthly')),
  subtotal DECIMAL(10, 2) NOT NULL,
  condition_on_pickup TEXT CHECK (condition_on_pickup IN ('new', 'good', 'fair', 'needs_repair')),
  condition_on_return TEXT CHECK (condition_on_return IN ('new', 'good', 'fair', 'damaged', 'missing')),
  pickup_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  return_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  damage_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rental_id UUID REFERENCES public.rentals(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'transfer', 'other')),
  payment_type TEXT DEFAULT 'rental_fee' CHECK (payment_type IN ('rental_fee', 'deposit', 'late_fee', 'damage_charge')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  transaction_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Expenses table (Phase 2, but schema ready)
CREATE TABLE public.expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  receipt_url TEXT,
  expense_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Categories indexes
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_categories_sort_order ON public.categories(user_id, sort_order);

-- Inventory items indexes
CREATE INDEX idx_inventory_user_id ON public.inventory_items(user_id);
CREATE INDEX idx_inventory_category_id ON public.inventory_items(category_id);
CREATE INDEX idx_inventory_status ON public.inventory_items(user_id, status);
CREATE INDEX idx_inventory_name ON public.inventory_items(user_id, name);

-- Customers indexes
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_phone ON public.customers(user_id, phone_number);
CREATE INDEX idx_customers_email ON public.customers(user_id, email);
CREATE INDEX idx_customers_name ON public.customers(user_id, full_name);

-- Rentals indexes
CREATE INDEX idx_rentals_user_id ON public.rentals(user_id);
CREATE INDEX idx_rentals_customer_id ON public.rentals(customer_id);
CREATE INDEX idx_rentals_status ON public.rentals(user_id, status);
CREATE INDEX idx_rentals_dates ON public.rentals(user_id, start_date, end_date);
CREATE INDEX idx_rentals_rental_number ON public.rentals(user_id, rental_number);

-- Rental items indexes
CREATE INDEX idx_rental_items_rental_id ON public.rental_items(rental_id);
CREATE INDEX idx_rental_items_item_id ON public.rental_items(item_id);

-- Payments indexes
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_rental_id ON public.payments(rental_id);
CREATE INDEX idx_payments_transaction_date ON public.payments(user_id, transaction_date);

-- Expenses indexes
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_expense_date ON public.expenses(user_id, expense_date);

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Categories policies
CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- Inventory items policies
CREATE POLICY "Users can view their own inventory"
  ON public.inventory_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inventory"
  ON public.inventory_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory"
  ON public.inventory_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory"
  ON public.inventory_items FOR DELETE
  USING (auth.uid() = user_id);

-- Customers policies
CREATE POLICY "Users can view their own customers"
  ON public.customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers"
  ON public.customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers"
  ON public.customers FOR DELETE
  USING (auth.uid() = user_id);

-- Rentals policies
CREATE POLICY "Users can view their own rentals"
  ON public.rentals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rentals"
  ON public.rentals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rentals"
  ON public.rentals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rentals"
  ON public.rentals FOR DELETE
  USING (auth.uid() = user_id);

-- Rental items policies
CREATE POLICY "Users can view rental items from their rentals"
  ON public.rental_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals
      WHERE rentals.id = rental_items.rental_id
      AND rentals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rental items for their rentals"
  ON public.rental_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rentals
      WHERE rentals.id = rental_items.rental_id
      AND rentals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update rental items from their rentals"
  ON public.rental_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals
      WHERE rentals.id = rental_items.rental_id
      AND rentals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete rental items from their rentals"
  ON public.rental_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.rentals
      WHERE rentals.id = rental_items.rental_id
      AND rentals.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON public.payments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments"
  ON public.payments FOR DELETE
  USING (auth.uid() = user_id);

-- Expenses policies
CREATE POLICY "Users can view their own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================
-- FUNCTIONS & TRIGGERS
-- ==============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_inventory
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_customers
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_rentals
  BEFORE UPDATE ON public.rentals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_rental_items
  BEFORE UPDATE ON public.rental_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function: Generate rental number (RENT-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION public.generate_rental_number(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_date TEXT;
  v_count INTEGER;
  v_number TEXT;
BEGIN
  v_date := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');

  -- Get count of rentals for this user today
  SELECT COUNT(*) INTO v_count
  FROM public.rentals
  WHERE user_id = p_user_id
  AND rental_number LIKE 'RENT-' || v_date || '-%';

  v_number := 'RENT-' || v_date || '-' || LPAD((v_count + 1)::TEXT, 4, '0');

  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate item availability for date range
CREATE OR REPLACE FUNCTION public.check_item_availability(
  p_item_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_exclude_rental_id UUID DEFAULT NULL
)
RETURNS TABLE(available_quantity INTEGER, booked_quantity INTEGER) AS $$
DECLARE
  v_total_quantity INTEGER;
  v_booked_quantity INTEGER;
BEGIN
  -- Get total quantity for item
  SELECT quantity_total INTO v_total_quantity
  FROM public.inventory_items
  WHERE id = p_item_id;

  -- Calculate booked quantity during the date range
  SELECT COALESCE(SUM(ri.quantity), 0)::INTEGER INTO v_booked_quantity
  FROM public.rental_items ri
  JOIN public.rentals r ON r.id = ri.rental_id
  WHERE ri.item_id = p_item_id
  AND r.status IN ('upcoming', 'active')
  AND (p_exclude_rental_id IS NULL OR r.id != p_exclude_rental_id)
  AND (
    -- Check for date overlap
    (r.start_date, r.end_date) OVERLAPS (p_start_date, p_end_date)
  );

  RETURN QUERY SELECT
    (v_total_quantity - v_booked_quantity)::INTEGER AS available_quantity,
    v_booked_quantity::INTEGER AS booked_quantity;
END;
$$ LANGUAGE plpgsql;

-- Function: Update rental status based on dates
CREATE OR REPLACE FUNCTION public.update_rental_status()
RETURNS void AS $$
BEGIN
  -- Update upcoming rentals to active if start date has passed
  UPDATE public.rentals
  SET status = 'active'
  WHERE status = 'upcoming'
  AND start_date <= NOW()
  AND end_date > NOW();

  -- Update active rentals to overdue if end date has passed
  UPDATE public.rentals
  SET status = 'overdue'
  WHERE status = 'active'
  AND end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate customer reliability score
CREATE OR REPLACE FUNCTION public.calculate_customer_reliability_score(p_customer_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total_rentals INTEGER;
  v_late_returns INTEGER;
  v_damaged_items INTEGER;
  v_score INTEGER;
BEGIN
  -- Count total completed rentals
  SELECT COUNT(*) INTO v_total_rentals
  FROM public.rentals
  WHERE customer_id = p_customer_id
  AND status = 'completed';

  -- If no rentals, return default score
  IF v_total_rentals = 0 THEN
    RETURN 100;
  END IF;

  -- Count late returns
  SELECT COUNT(*) INTO v_late_returns
  FROM public.rentals
  WHERE customer_id = p_customer_id
  AND status = 'completed'
  AND actual_return_date > end_date;

  -- Count rentals with damaged items
  SELECT COUNT(DISTINCT ri.rental_id) INTO v_damaged_items
  FROM public.rental_items ri
  JOIN public.rentals r ON r.id = ri.rental_id
  WHERE r.customer_id = p_customer_id
  AND ri.condition_on_return IN ('damaged', 'missing');

  -- Calculate score (100 base, -10 per late return, -20 per damaged item)
  v_score := 100
    - (v_late_returns * 10)
    - (v_damaged_items * 20);

  -- Ensure score is between 0 and 100
  v_score := GREATEST(0, LEAST(100, v_score));

  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate rental number on insert
CREATE OR REPLACE FUNCTION public.set_rental_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rental_number IS NULL OR NEW.rental_number = '' THEN
    NEW.rental_number := public.generate_rental_number(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_rental_number
  BEFORE INSERT ON public.rentals
  FOR EACH ROW EXECUTE FUNCTION public.set_rental_number();

-- Trigger: Update customer reliability score after rental completion
CREATE OR REPLACE FUNCTION public.update_customer_reliability()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.customers
    SET reliability_score = public.calculate_customer_reliability_score(NEW.customer_id)
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_reliability
  AFTER UPDATE ON public.rentals
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_reliability();

-- ==============================================
-- STORAGE BUCKETS
-- ==============================================

-- Note: Storage buckets are created via Supabase Dashboard or CLI
-- We'll create policies for them here

-- Create storage buckets (run this via Supabase CLI or Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('condition-photos', 'condition-photos', false);

-- ==============================================
-- VIEWS FOR ANALYTICS
-- ==============================================

-- View: Rental summary with customer and payment info
CREATE OR REPLACE VIEW public.rental_summary AS
SELECT
  r.id,
  r.user_id,
  r.rental_number,
  r.status,
  r.start_date,
  r.end_date,
  r.actual_return_date,
  r.total_amount,
  r.deposit_amount,
  r.payment_status,
  r.created_at,
  c.id AS customer_id,
  c.full_name AS customer_name,
  c.phone_number AS customer_phone,
  c.reliability_score,
  COUNT(DISTINCT ri.id) AS item_count,
  COALESCE(SUM(p.amount), 0) AS total_paid
FROM public.rentals r
JOIN public.customers c ON c.id = r.customer_id
LEFT JOIN public.rental_items ri ON ri.rental_id = r.id
LEFT JOIN public.payments p ON p.rental_id = r.id AND p.status = 'completed'
GROUP BY r.id, c.id;

-- View: Inventory utilization
CREATE OR REPLACE VIEW public.inventory_utilization AS
SELECT
  ii.id,
  ii.user_id,
  ii.name,
  ii.category_id,
  ii.quantity_total,
  ii.status,
  COUNT(DISTINCT ri.rental_id) AS total_rentals,
  COALESCE(SUM(ri.subtotal), 0) AS total_revenue,
  ii.purchase_cost,
  CASE
    WHEN ii.purchase_cost > 0 THEN
      (COALESCE(SUM(ri.subtotal), 0) / ii.purchase_cost * 100)
    ELSE NULL
  END AS roi_percentage
FROM public.inventory_items ii
LEFT JOIN public.rental_items ri ON ri.item_id = ii.id
GROUP BY ii.id;

-- ==============================================
-- SEED DATA (Optional - for testing)
-- ==============================================

-- Note: Seed data should be added after user signup via application
-- This is just a reference for the structure

-- Example: Default categories (to be inserted after user signs up)
-- INSERT INTO public.categories (user_id, name, icon, sort_order) VALUES
-- (auth.uid(), 'Equipment', '🔧', 1),
-- (auth.uid(), 'Tools', '🛠️', 2),
-- (auth.uid(), 'Vehicles', '🚗', 3),
-- (auth.uid(), 'Party Supplies', '🎉', 4),
-- (auth.uid(), 'Electronics', '📱', 5);

-- ==============================================
-- GRANTS (Public schema access)
-- ==============================================

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to all tables for authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Anonymous users (not logged in) should have no access
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- ==============================================
-- COMMENTS (Documentation)
-- ==============================================

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.categories IS 'Inventory categories for organizing items';
COMMENT ON TABLE public.inventory_items IS 'Rental inventory with pricing and availability';
COMMENT ON TABLE public.customers IS 'Customer database with reliability tracking';
COMMENT ON TABLE public.rentals IS 'Rental transactions and bookings';
COMMENT ON TABLE public.rental_items IS 'Items included in each rental (many-to-many)';
COMMENT ON TABLE public.payments IS 'Payment transactions for rentals';
COMMENT ON TABLE public.expenses IS 'Business expenses for P&L tracking';

COMMENT ON FUNCTION public.generate_rental_number IS 'Auto-generates unique rental numbers in format RENT-YYYYMMDD-XXXX';
COMMENT ON FUNCTION public.check_item_availability IS 'Checks item availability for a date range considering existing bookings';
COMMENT ON FUNCTION public.calculate_customer_reliability_score IS 'Calculates customer reliability score based on rental history';
COMMENT ON FUNCTION public.update_rental_status IS 'Updates rental status based on current date (upcoming -> active -> overdue)';

-- Migration complete
