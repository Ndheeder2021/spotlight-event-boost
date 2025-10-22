-- Update tenant to professional plan and active status
UPDATE tenants
SET 
  plan = 'professional',
  status = 'active'
WHERE id = 'b6d06aac-16a7-428a-b990-bd963a0bd8d1';