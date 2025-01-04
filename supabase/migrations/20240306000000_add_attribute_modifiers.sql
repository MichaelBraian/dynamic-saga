-- Add base_value and modifier columns to character_attributes
ALTER TABLE character_attributes
ADD COLUMN IF NOT EXISTS base_value integer,
ADD COLUMN IF NOT EXISTS modifier integer DEFAULT 0;

-- Update existing rows to set base_value to current value
UPDATE character_attributes
SET base_value = value
WHERE base_value IS NULL;

-- Make value a computed column
ALTER TABLE character_attributes
DROP COLUMN value,
ADD COLUMN value integer GENERATED ALWAYS AS (base_value + modifier) STORED; 