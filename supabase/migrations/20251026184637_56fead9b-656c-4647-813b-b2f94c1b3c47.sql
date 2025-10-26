-- Create lead_finder_jobs table
CREATE TABLE IF NOT EXISTS public.lead_finder_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cities TEXT[] NOT NULL,
  business_types TEXT[] NOT NULL,
  max_results_per_city INTEGER NOT NULL DEFAULT 150,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL DEFAULT 0,
  results_json JSONB DEFAULT '[]'::jsonb,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.lead_finder_jobs ENABLE ROW LEVEL SECURITY;

-- Admins can view all jobs
CREATE POLICY "Admins can view all lead finder jobs"
ON public.lead_finder_jobs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can create jobs
CREATE POLICY "Admins can create lead finder jobs"
ON public.lead_finder_jobs
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

-- Admins can update their own jobs
CREATE POLICY "Admins can update their lead finder jobs"
ON public.lead_finder_jobs
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) AND user_id = auth.uid());

-- Add index for performance
CREATE INDEX idx_lead_finder_jobs_user_id ON public.lead_finder_jobs(user_id);
CREATE INDEX idx_lead_finder_jobs_status ON public.lead_finder_jobs(status);
CREATE INDEX idx_lead_finder_jobs_created_at ON public.lead_finder_jobs(created_at DESC);