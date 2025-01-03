-- Add clothing_type column to characters table
ALTER TABLE characters ADD COLUMN IF NOT EXISTS clothing_type text;

-- Create a new enum without the 'armor' value
CREATE TYPE character_status_new AS ENUM (
    'naming', 'questioning', 'attributes', 'specialty', 'faith_points', 
    'generated', 'completed', 'class', 'gender', 'race', 'animal_type', 
    'clothing', 'morality'
);

-- Remove the default value temporarily
ALTER TABLE characters ALTER COLUMN status DROP DEFAULT;

-- Convert to the new enum type
ALTER TABLE characters 
    ALTER COLUMN status TYPE character_status_new 
    USING (
        CASE 
            WHEN status::text = 'armor' THEN 'clothing'
            ELSE status::text
        END
    )::character_status_new;

-- Drop the old enum type
DROP TYPE character_status;

-- Rename the new enum type to the original name
ALTER TYPE character_status_new RENAME TO character_status;

-- Restore the default value
ALTER TABLE characters ALTER COLUMN status SET DEFAULT 'naming'::character_status;

-- Grant necessary permissions
GRANT ALL ON characters TO postgres, anon, authenticated, service_role; 