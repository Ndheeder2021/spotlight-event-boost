-- Grant admin role to user
DO $$
DECLARE
  v_user_id uuid;
  v_tenant_id uuid;
BEGIN
  -- Get the user_id for the specified email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'nabbe_1997@hotmail.com';

  -- If user exists, get their tenant_id from existing user_roles
  IF v_user_id IS NOT NULL THEN
    SELECT tenant_id INTO v_tenant_id
    FROM public.user_roles
    WHERE user_id = v_user_id
    LIMIT 1;

    -- If tenant_id exists, add admin role
    IF v_tenant_id IS NOT NULL THEN
      -- Insert admin role (ignore if already exists)
      INSERT INTO public.user_roles (user_id, tenant_id, role)
      VALUES (v_user_id, v_tenant_id, 'admin')
      ON CONFLICT DO NOTHING;
      
      RAISE NOTICE 'Admin role granted to user %', v_user_id;
    ELSE
      RAISE NOTICE 'User % has no tenant, cannot assign admin role', v_user_id;
    END IF;
  ELSE
    RAISE NOTICE 'User with email nabbe_1997@hotmail.com not found';
  END IF;
END $$;