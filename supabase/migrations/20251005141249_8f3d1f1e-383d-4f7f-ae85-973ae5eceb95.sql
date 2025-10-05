-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.app_role AS ENUM ('owner', 'staff', 'admin');
CREATE TYPE public.plan_type AS ENUM ('starter', 'pro', 'business');
CREATE TYPE public.tenant_status AS ENUM ('trial', 'active', 'past_due', 'canceled');
CREATE TYPE public.business_type AS ENUM ('cafe', 'bar', 'restaurant');
CREATE TYPE public.event_category AS ENUM ('concert', 'sports', 'conference', 'festival', 'theatre', 'community', 'other');
CREATE TYPE public.campaign_status AS ENUM ('draft', 'scheduled', 'published');
CREATE TYPE public.notification_channel AS ENUM ('email', 'inapp');

-- Create Tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan plan_type DEFAULT 'starter',
  status tenant_status DEFAULT 'trial',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for RBAC (separate from auth.users)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to get user's tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Update profiles table to be Locations table
ALTER TABLE public.profiles RENAME TO locations;
ALTER TABLE public.locations DROP COLUMN IF EXISTS email;
ALTER TABLE public.locations DROP COLUMN IF EXISTS business_name;
ALTER TABLE public.locations RENAME COLUMN business_type TO business_type_old;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS business_type business_type;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS address_line TEXT;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Sweden';
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS radius_km FLOAT DEFAULT 2.0;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS open_hours_text TEXT;

-- Update locations data if needed
UPDATE public.locations SET business_type = 
  CASE 
    WHEN business_type_old = 'cafe' THEN 'cafe'::business_type
    WHEN business_type_old = 'bar' THEN 'bar'::business_type
    ELSE 'restaurant'::business_type
  END
WHERE business_type IS NULL;

UPDATE public.locations SET name = address WHERE name IS NULL;

ALTER TABLE public.locations DROP COLUMN IF EXISTS business_type_old;
ALTER TABLE public.locations DROP COLUMN IF EXISTS opening_hours;

-- Fix existing event categories before type change
UPDATE public.events 
SET category = 'concert' 
WHERE category = 'music';

UPDATE public.events 
SET category = 'other' 
WHERE category NOT IN ('concert', 'sports', 'conference', 'festival', 'theatre', 'community', 'other');

-- Update events table
ALTER TABLE public.events ALTER COLUMN category TYPE event_category USING category::event_category;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS source_id TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS p10 INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS p90 INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS raw_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS city TEXT;

-- Drop old campaign policies before modifying table
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;

-- Update campaigns table
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS status campaign_status DEFAULT 'draft';
ALTER TABLE public.campaigns DROP COLUMN IF EXISTS user_id;

-- Create NotificationRules table
CREATE TABLE public.notification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  min_attendance INTEGER DEFAULT 1000,
  radius_km FLOAT DEFAULT 2.0,
  channel notification_channel DEFAULT 'email',
  enabled BOOLEAN DEFAULT true,
  last_fired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notification_rules ENABLE ROW LEVEL SECURITY;

-- Create Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create AuditLogs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  actor_user_id UUID,
  action TEXT,
  entity TEXT,
  entity_id TEXT,
  metadata_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tenants
CREATE POLICY "Users can view their own tenant"
  ON public.tenants FOR SELECT
  USING (id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Admins can view all tenants"
  ON public.tenants FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for Locations
DROP POLICY IF EXISTS "Users can view their own profile" ON public.locations;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.locations;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.locations;

CREATE POLICY "Users can view their tenant's locations"
  ON public.locations FOR SELECT
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Owners can manage locations"
  ON public.locations FOR ALL
  USING (tenant_id = public.get_user_tenant_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'));

-- RLS Policies for Campaigns
CREATE POLICY "Users can view their tenant's campaigns"
  ON public.campaigns FOR SELECT
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can create campaigns for their tenant"
  ON public.campaigns FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can update their tenant's campaigns"
  ON public.campaigns FOR UPDATE
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can delete their tenant's campaigns"
  ON public.campaigns FOR DELETE
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

-- RLS Policies for NotificationRules
CREATE POLICY "Users can view their tenant's notification rules"
  ON public.notification_rules FOR SELECT
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can manage their tenant's notification rules"
  ON public.notification_rules FOR ALL
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

-- RLS Policies for Subscriptions
CREATE POLICY "Users can view their tenant's subscription"
  ON public.subscriptions FOR SELECT
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Admins can manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for AuditLogs
CREATE POLICY "Users can view their tenant's audit logs"
  ON public.audit_logs FOR SELECT
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger for handle_new_user to create tenant and assign role
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_tenant_id UUID;
BEGIN
  -- Create a new tenant for the user
  INSERT INTO public.tenants (name, plan, status)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'business_name', NEW.email),
    'starter',
    'trial'
  )
  RETURNING id INTO new_tenant_id;

  -- Assign owner role to the user
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (NEW.id, new_tenant_id, 'owner');

  -- Create initial location for the tenant
  INSERT INTO public.locations (
    id,
    tenant_id,
    name,
    business_type,
    address_line,
    lat,
    lon
  )
  VALUES (
    NEW.id,
    new_tenant_id,
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business'),
    COALESCE((NEW.raw_user_meta_data->>'business_type')::business_type, 'restaurant'),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE((NEW.raw_user_meta_data->>'lat')::double precision, 59.3293),
    COALESCE((NEW.raw_user_meta_data->>'lon')::double precision, 18.0686)
  );

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_tenant_id ON public.user_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_locations_tenant_id ON public.locations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_city ON public.events(city);
CREATE INDEX IF NOT EXISTS idx_campaigns_tenant_id ON public.campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_location_id ON public.campaigns(location_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_event_id ON public.campaigns(event_id);
CREATE INDEX IF NOT EXISTS idx_notification_rules_tenant_id ON public.notification_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notification_rules_location_id ON public.notification_rules(location_id);