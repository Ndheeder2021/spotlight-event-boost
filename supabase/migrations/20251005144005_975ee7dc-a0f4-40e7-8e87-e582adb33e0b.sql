-- Fix the handle_new_user function to include the address column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_tenant_id UUID;
BEGIN
  -- Create a new tenant for the user
  INSERT INTO public.tenants (name, plan, status)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'business_name', NEW.email),
    'starter',
    'trial'
  )
  RETURNING id INTO new_tenant_id;

  -- Assign owner role to the user
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (NEW.id, new_tenant_id, 'owner');

  -- Create initial location for the tenant
  INSERT INTO public.locations (
    id,
    tenant_id,
    name,
    business_type,
    address,
    address_line,
    lat,
    lon
  )
  VALUES (
    NEW.id,
    new_tenant_id,
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'),
    COALESCE((NEW.raw_user_meta_data->>'business_type')::business_type, 'restaurant'),
    COALESCE(NEW.raw_user_meta_data->>'address', 'Not specified'),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE((NEW.raw_user_meta_data->>'lat')::double precision, 59.3293),
    COALESCE((NEW.raw_user_meta_data->>'lon')::double precision, 18.0686)
  );

  RETURN NEW;
END;
$function$;