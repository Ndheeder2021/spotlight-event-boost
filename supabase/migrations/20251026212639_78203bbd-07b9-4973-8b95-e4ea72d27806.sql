-- Drop the insecure policy that allows anyone to view all leads
DROP POLICY IF EXISTS "Users can view all leads" ON public.leads;

-- Create a secure policy that only allows admins to view leads
CREATE POLICY "Only admins can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));