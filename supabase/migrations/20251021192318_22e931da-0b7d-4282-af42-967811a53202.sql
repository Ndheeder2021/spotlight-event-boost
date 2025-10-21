-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  referral_code TEXT UNIQUE NOT NULL,
  referred_count INTEGER DEFAULT 0,
  total_commission NUMERIC DEFAULT 0,
  commission_rate NUMERIC DEFAULT 0.20, -- 20% commission
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create referred_users table to track conversions
CREATE TABLE public.referred_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code TEXT NOT NULL REFERENCES public.referrals(referral_code),
  referred_email TEXT,
  referred_user_id UUID,
  status TEXT DEFAULT 'pending', -- pending, signed_up, subscribed
  commission_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referred_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals
CREATE POLICY "Anyone can insert their referral"
  ON public.referrals
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own referral by email"
  ON public.referrals
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own referral"
  ON public.referrals
  FOR UPDATE
  USING (email = auth.jwt()->>'email');

-- RLS Policies for referred_users
CREATE POLICY "Anyone can insert referred users"
  ON public.referred_users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view referred users"
  ON public.referred_users
  FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_email ON public.referrals(email);
CREATE INDEX idx_referred_users_code ON public.referred_users(referral_code);

-- Create trigger to update updated_at
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8 character code
    code := UPPER(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = code) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;