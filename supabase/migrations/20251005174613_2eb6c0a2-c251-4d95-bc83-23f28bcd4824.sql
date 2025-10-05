-- Extend campaigns table with additional fields for saved campaigns
ALTER TABLE public.campaigns
ADD COLUMN IF NOT EXISTS ai_generated_data jsonb,
ADD COLUMN IF NOT EXISTS user_edited_data jsonb,
ADD COLUMN IF NOT EXISTS is_template boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create trigger for updated_at
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Campaign shares for Professional plan
CREATE TABLE IF NOT EXISTS public.campaign_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  tenant_id uuid NOT NULL,
  share_token text UNIQUE NOT NULL,
  password_hash text,
  expires_at timestamp with time zone,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.campaign_shares ENABLE ROW LEVEL SECURITY;

-- Users can manage shares for their tenant's campaigns
CREATE POLICY "Users can manage their tenant's shares"
ON public.campaign_shares
FOR ALL
USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Public can view shared campaigns with valid token (checked in application logic)
CREATE POLICY "Anyone can view with valid token"
ON public.campaign_shares
FOR SELECT
USING (true);

-- Campaign comments for Professional plan
CREATE TABLE IF NOT EXISTS public.campaign_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  tenant_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text,
  content text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_comments ENABLE ROW LEVEL SECURITY;

-- Users can view comments for their tenant's campaigns
CREATE POLICY "Users can view their tenant's campaign comments"
ON public.campaign_comments
FOR SELECT
USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Users can create comments for their tenant's campaigns
CREATE POLICY "Users can create comments on their tenant's campaigns"
ON public.campaign_comments
FOR INSERT
WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

-- Campaign analytics for Professional plan
CREATE TABLE IF NOT EXISTS public.campaign_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  tenant_id uuid NOT NULL,
  metric_type text NOT NULL, -- 'view', 'click', 'conversion', 'roi'
  metric_value numeric NOT NULL,
  metadata jsonb,
  recorded_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Users can view analytics for their tenant's campaigns
CREATE POLICY "Users can view their tenant's campaign analytics"
ON public.campaign_analytics
FOR SELECT
USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Users can insert analytics for their tenant's campaigns
CREATE POLICY "Users can insert analytics for their tenant's campaigns"
ON public.campaign_analytics
FOR INSERT
WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

-- Campaign attachments (PDF exports, generated images) for Professional plan
CREATE TABLE IF NOT EXISTS public.campaign_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  tenant_id uuid NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL, -- 'pdf', 'image', 'document'
  file_data text, -- base64 or storage reference
  storage_path text, -- if using Supabase storage
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_attachments ENABLE ROW LEVEL SECURITY;

-- Users can manage attachments for their tenant's campaigns
CREATE POLICY "Users can manage their tenant's campaign attachments"
ON public.campaign_attachments
FOR ALL
USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaign_shares_token ON public.campaign_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_campaign_shares_campaign_id ON public.campaign_shares(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_comments_campaign_id ON public.campaign_comments(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_metric_type ON public.campaign_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_campaign_attachments_campaign_id ON public.campaign_attachments(campaign_id);