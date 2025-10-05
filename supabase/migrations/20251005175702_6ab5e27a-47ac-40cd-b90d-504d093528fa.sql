-- Allow owners to update their tenant's plan
CREATE POLICY "Owners can update their tenant's plan"
ON public.tenants
FOR UPDATE
USING (
  id = get_user_tenant_id(auth.uid()) 
  AND has_role(auth.uid(), 'owner'::app_role)
)
WITH CHECK (
  id = get_user_tenant_id(auth.uid()) 
  AND has_role(auth.uid(), 'owner'::app_role)
);