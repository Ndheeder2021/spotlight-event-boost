-- Fix search_path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, business_name, business_type, address, lat, lon)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'),
    COALESCE(NEW.raw_user_meta_data->>'business_type', 'restaurant'),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE((NEW.raw_user_meta_data->>'lat')::double precision, 0),
    COALESCE((NEW.raw_user_meta_data->>'lon')::double precision, 0)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;