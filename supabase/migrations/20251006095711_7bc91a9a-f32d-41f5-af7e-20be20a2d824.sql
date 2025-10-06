-- Update user role to admin
UPDATE public.user_roles
SET role = 'admin'::app_role
WHERE user_id = 'c37f7cba-d56d-48f7-9ce8-33edfbe2a988'::uuid;