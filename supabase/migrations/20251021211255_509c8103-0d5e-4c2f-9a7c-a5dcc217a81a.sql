-- Create leads table for email capture
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT email_unique UNIQUE (email)
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting leads (no authentication required)
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reading own data (for future use)
CREATE POLICY "Users can view all leads"
  ON public.leads
  FOR SELECT
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);