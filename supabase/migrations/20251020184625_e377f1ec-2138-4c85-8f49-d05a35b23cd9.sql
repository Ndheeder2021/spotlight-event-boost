-- Create team invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role app_role NOT NULL,
  invited_by UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Owners can manage invitations for their tenant
CREATE POLICY "Owners can manage team invitations"
ON public.team_invitations
FOR ALL
USING (
  tenant_id = get_user_tenant_id(auth.uid()) 
  AND has_role(auth.uid(), 'owner'::app_role)
);

-- Anyone can view invitations by token (for accepting)
CREATE POLICY "Anyone can view invitation by token"
ON public.team_invitations
FOR SELECT
USING (true);

-- Add index for performance
CREATE INDEX idx_team_invitations_token ON public.team_invitations(token);
CREATE INDEX idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX idx_team_invitations_tenant ON public.team_invitations(tenant_id);