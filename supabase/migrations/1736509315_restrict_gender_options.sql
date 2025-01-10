-- Restrict gender column to only allow 'male' or 'female'
ALTER TABLE characters
  DROP CONSTRAINT IF EXISTS characters_gender_check;

ALTER TABLE characters
  ADD CONSTRAINT characters_gender_check 
  CHECK (gender IN ('male', 'female'));

-- Update any existing records that don't match the new constraint
UPDATE characters
SET gender = 'male'
WHERE gender NOT IN ('male', 'female');

-- Set default pronouns based on gender
UPDATE characters
SET pronouns = CASE 
  WHEN gender = 'male' THEN '{"subject": "he", "object": "him", "possessive": "his"}'::jsonb
  WHEN gender = 'female' THEN '{"subject": "she", "object": "her", "possessive": "hers"}'::jsonb
END; 