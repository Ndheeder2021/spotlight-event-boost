-- Enable pgcrypto extension (it may already exist in extensions schema)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add token_hash column for storing hashed tokens
ALTER TABLE public.team_invitations
ADD COLUMN IF NOT EXISTS token_hash text;

-- Create index on token_hash for faster lookups
CREATE INDEX IF NOT EXISTS idx_team_invitations_token_hash 
ON public.team_invitations(token_hash);

-- Helper function to hash tokens
CREATE OR REPLACE FUNCTION public.hash_token(_token text)
RETURNS text
LANGUAGE sql
IMMUTABLE STRICT
AS $$
  SELECT encode(extensions.digest(_token, 'sha256'), 'hex');
$$;

-- Update the get_invitation_by_token function to use hashed tokens
DROP FUNCTION IF EXISTS public.get_invitation_by_token(_token text);

CREATE OR REPLACE FUNCTION public.get_invitation_by_token(_token text)
RETURNS TABLE(
  id uuid, 
  tenant_id uuid, 
  email text, 
  role app_role, 
  invited_by uuid, 
  expires_at timestamp with time zone, 
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT id, tenant_id, email, role, invited_by, expires_at, created_at
  FROM public.team_invitations
  WHERE token_hash = public.hash_token(_token)
    AND expires_at > now()
    AND accepted_at IS NULL
  LIMIT 1;
$function$;

-- Update RLS policies to prevent token and token_hash exposure
DROP POLICY IF EXISTS "Tenant owners and admins can view invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Tenant owners and admins can create invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Tenant owners and admins can update invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Tenant owners and admins can delete invitations" ON public.team_invitations;

-- Owners and admins can view invitation metadata
CREATE POLICY "Tenant owners and admins can view invitation metadata"
ON public.team_invitations
FOR SELECT
TO authenticated
USING (
  (tenant_id = get_user_tenant_id(auth.uid())) 
  AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Only service role can create invitations (via edge function)
CREATE POLICY "Service role can create invitations"
ON public.team_invitations
FOR INSERT
TO service_role
WITH CHECK (true);

-- Owners and admins can update invitations
CREATE POLICY "Tenant owners and admins can update invitations"
ON public.team_invitations
FOR UPDATE
TO authenticated
USING (
  (tenant_id = get_user_tenant_id(auth.uid())) 
  AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Owners and admins can delete invitations
CREATE POLICY "Tenant owners and admins can delete invitations"
ON public.team_invitations
FOR DELETE
TO authenticated
USING (
  (tenant_id = get_user_tenant_id(auth.uid())) 
  AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);