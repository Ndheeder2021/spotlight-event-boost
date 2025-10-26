-- Add audit logging table for invitation access attempts
CREATE TABLE IF NOT EXISTS public.invitation_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.invitation_access_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view invitation access logs"
ON public.invitation_access_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_invitation_access_logs_created_at 
ON public.invitation_access_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invitation_access_logs_token 
ON public.invitation_access_logs(token);

-- Add comment for documentation
COMMENT ON TABLE public.invitation_access_logs IS 'Audit log for team invitation token validation attempts to detect enumeration attacks';