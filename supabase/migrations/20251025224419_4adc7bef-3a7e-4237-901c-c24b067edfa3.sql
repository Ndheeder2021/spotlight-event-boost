-- Add optional detailed business description columns to locations table
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS business_description TEXT,
ADD COLUMN IF NOT EXISTS target_customer_profile TEXT,
ADD COLUMN IF NOT EXISTS unique_selling_points TEXT,
ADD COLUMN IF NOT EXISTS typical_offerings TEXT,
ADD COLUMN IF NOT EXISTS brand_tone TEXT,
ADD COLUMN IF NOT EXISTS previous_successful_campaigns TEXT;

-- Add comments to document the purpose of each column
COMMENT ON COLUMN locations.business_description IS 'Fri beskrivning av verksamheten (max 500 tecken) - valfritt';
COMMENT ON COLUMN locations.target_customer_profile IS 'Beskrivning av typiska kunder och målgrupp - valfritt';
COMMENT ON COLUMN locations.unique_selling_points IS 'Vad som är unikt med verksamheten - valfritt';
COMMENT ON COLUMN locations.typical_offerings IS 'Typiska erbjudanden, produkter eller tjänster - valfritt';
COMMENT ON COLUMN locations.brand_tone IS 'Önskad ton i marknadsföring (t.ex. professionell, casual, lyxig) - valfritt';
COMMENT ON COLUMN locations.previous_successful_campaigns IS 'Beskrivning av tidigare framgångsrika kampanjer - valfritt';