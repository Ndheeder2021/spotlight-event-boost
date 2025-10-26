-- Drop existing policy
DROP POLICY IF EXISTS "Owners and admins can manage team invitations" ON public.team_invitations;

-- Create separate policies for better security

-- Only owners and admins from the same tenant can SELECT invitations
CREATE POLICY "Tenant owners and admins can view invitations"
ON public.team_invitations
FOR SELECT
TO authenticated
USING (
  tenant_id = get_user_tenant_id(auth.uid())
  AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Only owners and admins can INSERT invitations for their tenant
CREATE POLICY "Tenant owners and admins can create invitations"
ON public.team_invitations
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = get_user_tenant_id(auth.uid())
  AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Only owners and admins can UPDATE invitations for their tenant
CREATE POLICY "Tenant owners and admins can update invitations"
ON public.team_invitations
FOR UPDATE
TO authenticated
USING (
  tenant_id = get_user_tenant_id(auth.uid())
  AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Only owners and admins can DELETE invitations for their tenant
CREATE POLICY "Tenant owners and admins can delete invitations"
ON public.team_invitations
FOR DELETE
TO authenticated
USING (
  tenant_id = get_user_tenant_id(auth.uid())
  AND (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Ensure the secure function can still be used for token validation
-- (it already uses SECURITY DEFINER so it bypasses RLS)