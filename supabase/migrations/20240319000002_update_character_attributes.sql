-- Add base_value and modifier columns to character_attributes
ALTER TABLE character_attributes
ADD COLUMN IF NOT EXISTS base_value INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS modifier INTEGER NOT NULL DEFAULT 0;

-- Update value to be a computed column
ALTER TABLE character_attributes
DROP COLUMN IF EXISTS value;

ALTER TABLE character_attributes
ADD COLUMN value INTEGER GENERATED ALWAYS AS (base_value + modifier) STORED; 