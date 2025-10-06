-- Create table for internal business events
CREATE TABLE public.internal_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT NOT NULL, -- 'live_band', 'promotion', 'custom'
  color TEXT DEFAULT '#FFD700',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.internal_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their tenant's internal events"
  ON public.internal_events FOR SELECT
  USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can create internal events for their tenant"
  ON public.internal_events FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can update their tenant's internal events"
  ON public.internal_events FOR UPDATE
  USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can delete their tenant's internal events"
  ON public.internal_events FOR DELETE
  USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_internal_events_updated_at
  BEFORE UPDATE ON public.internal_events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();