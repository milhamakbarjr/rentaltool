-- Add trigger to auto-create profile on user signup
-- Migration: 20251117000003_add_auto_create_profile_trigger
-- Description: Automatically create a profile row when a new user signs up

-- ==============================================
-- FUNCTION: Create profile for new user
-- ==============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, business_name, timezone, currency)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'business_name',
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'Asia/Singapore'),
    COALESCE(NEW.raw_user_meta_data->>'currency', 'SGD')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- TRIGGER: Auto-create profile on signup
-- ==============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- COMMENTS
-- ==============================================

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates a profile row when a new user signs up';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Trigger to auto-create profile for new users';
