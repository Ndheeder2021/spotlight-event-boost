-- Create investor_applications table
CREATE TABLE IF NOT EXISTS public.investor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  investment_range TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investor_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit applications
CREATE POLICY "Anyone can submit investor applications"
  ON public.investor_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Admins can view all investor applications"
  ON public.investor_applications
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));