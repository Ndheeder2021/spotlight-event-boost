-- Fix security issue: Restrict investor_applications access
-- Remove the public INSERT policy that allows anyone to submit applications
DROP POLICY IF EXISTS "Service role can insert investor applications" ON public.investor_applications;

-- The table now only has the admin SELECT policy, which is secure
-- Edge functions should use service role key to insert applications

-- Add a comment to document the security model
COMMENT ON TABLE public.investor_applications IS 'Investor applications - Only admins can view. Insertions must be done via edge functions using service role key.';