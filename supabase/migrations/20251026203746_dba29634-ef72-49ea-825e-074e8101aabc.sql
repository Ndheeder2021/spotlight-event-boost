-- Drop the existing policy that only allows owners
DROP POLICY IF EXISTS "Owners can manage team invitations" ON public.team_invitations;

-- Create new policy that allows both owners and admins to manage team invitations
CREATE POLICY "Owners and admins can manage team invitations" 
ON public.team_invitations
FOR ALL
TO authenticated
USING (
  (tenant_id = get_user_tenant_id(auth.uid())) 
  AND (
    has_role(auth.uid(), 'owner'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
)
WITH CHECK (
  (tenant_id = get_user_tenant_id(auth.uid())) 
  AND (
    has_role(auth.uid(), 'owner'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);