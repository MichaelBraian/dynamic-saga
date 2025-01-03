-- Create the characters table if it doesn't exist
CREATE TABLE IF NOT EXISTS characters (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    gender text
);

-- Create a new enum type for gender
CREATE TYPE gender_type AS ENUM ('male', 'female');

-- Convert existing gender values to the new type
-- First, update any invalid values to NULL
UPDATE characters 
SET gender = NULL 
WHERE gender NOT IN ('male', 'female');

-- Alter the column type
ALTER TABLE characters 
ALTER COLUMN gender TYPE gender_type 
USING gender::gender_type;

-- Add a comment to explain the constraint
COMMENT ON COLUMN characters.gender IS 'Character gender: must be male or female'; 