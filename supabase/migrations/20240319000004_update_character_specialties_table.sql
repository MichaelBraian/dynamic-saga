-- Add unique constraint to character_id to ensure only one specialty per character
ALTER TABLE character_specialties
DROP CONSTRAINT IF EXISTS character_specialties_character_id_key;

ALTER TABLE character_specialties
ADD CONSTRAINT character_specialties_character_id_key UNIQUE (character_id);

-- Add foreign key constraints
ALTER TABLE character_specialties
DROP CONSTRAINT IF EXISTS character_specialties_character_id_fkey,
DROP CONSTRAINT IF EXISTS character_specialties_specialty_id_fkey;

ALTER TABLE character_specialties
ADD CONSTRAINT character_specialties_character_id_fkey
FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
ADD CONSTRAINT character_specialties_specialty_id_fkey
FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE; 