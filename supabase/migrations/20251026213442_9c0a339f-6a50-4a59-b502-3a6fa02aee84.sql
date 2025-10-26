-- Remove the public insert policy that allows direct database access
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- The Edge Functions (capture-lead, start-lead-finder) use service_role
-- which bypasses RLS, so they can still insert leads
-- Only admins can view leads through the existing policy