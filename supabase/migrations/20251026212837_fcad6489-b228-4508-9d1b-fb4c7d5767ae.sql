-- Remove the public insert policy on investor_applications
DROP POLICY IF EXISTS "Anyone can submit investor applications" ON public.investor_applications;

-- Create a more restrictive policy that only allows authenticated service role to insert
-- The Edge Function will use the service role key to insert validated data
CREATE POLICY "Service role can insert investor applications"
ON public.investor_applications
FOR INSERT
TO service_role
WITH CHECK (true);