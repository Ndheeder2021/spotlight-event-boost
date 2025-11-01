-- Drop the insecure public INSERT policy
DROP POLICY IF EXISTS "Anyone can insert referred users" ON public.referred_users;

-- Create a new policy that only allows authenticated edge functions 
-- (using service role key) to insert referred users
-- This ensures server-side validation of referral codes
CREATE POLICY "Service role can insert referred users"
ON public.referred_users
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow authenticated users to view their own referred users
DROP POLICY IF EXISTS "Anyone can view referred users" ON public.referred_users;

CREATE POLICY "Users can view referred users by their referral code"
ON public.referred_users
FOR SELECT
TO authenticated
USING (
  referral_code IN (
    SELECT referral_code 
    FROM public.referrals 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Admins can view all referred users
CREATE POLICY "Admins can view all referred users"
ON public.referred_users
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));