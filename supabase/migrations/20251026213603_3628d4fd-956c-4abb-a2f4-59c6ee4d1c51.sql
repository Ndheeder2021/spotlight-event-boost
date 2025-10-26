-- Remove insecure public SELECT policy
DROP POLICY IF EXISTS "Anyone can view their own referral by email" ON public.referrals;

-- Remove public INSERT policy (will use Edge Function instead)
DROP POLICY IF EXISTS "Anyone can insert their referral" ON public.referrals;

-- Remove the public UPDATE policy as well for consistency
DROP POLICY IF EXISTS "Users can update their own referral" ON public.referrals;

-- Create authenticated user policy to view their own referral
CREATE POLICY "Authenticated users can view their own referral"
ON public.referrals
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create authenticated user policy to update their own referral  
CREATE POLICY "Authenticated users can update their own referral"
ON public.referrals
FOR UPDATE
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Service role can manage all referrals (used by Edge Functions)
-- This is implicitly allowed by service_role bypassing RLS