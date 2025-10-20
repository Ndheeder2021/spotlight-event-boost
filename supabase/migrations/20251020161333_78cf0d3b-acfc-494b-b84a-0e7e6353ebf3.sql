-- Update default radius to 20km for all locations
ALTER TABLE public.locations 
ALTER COLUMN radius_km SET DEFAULT 20.0;

-- Update existing locations with small radius to 20km
UPDATE public.locations 
SET radius_km = 20.0 
WHERE radius_km IS NULL OR radius_km < 20.0;