-- Upgrade user to Professional plan
UPDATE public.tenants 
SET plan = 'professional'
WHERE id = '7a53f243-8645-4c72-a469-6db4b82fc062';