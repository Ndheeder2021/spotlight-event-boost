-- Allow admins to manage locations as well as owners
CREATE POLICY "Admins can manage locations"
ON public.locations
FOR ALL
USING (
  tenant_id = public.get_user_tenant_id(auth.uid())
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  tenant_id = public.get_user_tenant_id(auth.uid())
  AND public.has_role(auth.uid(), 'admin')
);
