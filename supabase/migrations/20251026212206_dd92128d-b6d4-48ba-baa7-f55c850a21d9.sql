-- Drop the insecure policy that allows anyone to view all invitations
DROP POLICY IF EXISTS "Anyone can view invitation by token" ON public.team_invitations;

-- Create a secure function that validates the token before returning invitation details
CREATE OR REPLACE FUNCTION public.get_invitation_by_token(_token text)
RETURNS TABLE (
  id uuid,
  tenant_id uuid,
  email text,
  role app_role,
  invited_by uuid,
  expires_at timestamptz,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, tenant_id, email, role, invited_by, expires_at, created_at
  FROM public.team_invitations
  WHERE token = _token
    AND expires_at > now()
    AND accepted_at IS NULL
  LIMIT 1;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_invitation_by_token(text) TO authenticated, anon;