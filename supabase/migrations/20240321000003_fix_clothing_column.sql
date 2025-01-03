-- Add clothing_type column
ALTER TABLE characters ADD COLUMN IF NOT EXISTS clothing_type text;

-- Grant permissions
GRANT ALL ON characters TO postgres, anon, authenticated, service_role; 