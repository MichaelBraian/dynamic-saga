-- Add race column if it doesn't exist
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS race text;

-- Create a new enum type for race
CREATE TYPE race_type AS ENUM ('Human', 'Dwarf', 'Animal');

-- Convert existing race values to the new type
-- First, update any invalid values to NULL
UPDATE characters 
SET race = NULL 
WHERE race NOT IN ('Human', 'Dwarf', 'Animal');

-- Alter the column type
ALTER TABLE characters 
ALTER COLUMN race TYPE race_type 
USING race::race_type;

-- Add a comment to explain the constraint
COMMENT ON COLUMN characters.race IS 'Character race: must be Human, Dwarf, or Animal'; 