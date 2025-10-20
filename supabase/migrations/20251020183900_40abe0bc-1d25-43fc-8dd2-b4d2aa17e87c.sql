-- Extend app_role enum with more roles
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'moderator';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'viewer';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'editor';

-- Add white-label branding settings to tenants table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS branding jsonb DEFAULT '{
  "logo_url": null,
  "primary_color": null,
  "secondary_color": null,
  "company_name": null,
  "custom_domain": null
}'::jsonb;

-- Add API integration settings
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS api_settings jsonb DEFAULT '{
  "api_key": null,
  "webhook_url": null,
  "allowed_origins": []
}'::jsonb;