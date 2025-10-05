-- Update plan_type enum to include professional and enterprise
ALTER TYPE plan_type ADD VALUE IF NOT EXISTS 'professional';
ALTER TYPE plan_type ADD VALUE IF NOT EXISTS 'enterprise';