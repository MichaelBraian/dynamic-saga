-- Drop existing character_morality table
DROP TABLE IF EXISTS character_morality CASCADE;

-- Create character_morality table with correct schema
CREATE TABLE character_morality (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    character_id uuid REFERENCES characters(id) ON DELETE CASCADE,
    good_evil_scale integer NOT NULL CHECK (good_evil_scale >= -100 AND good_evil_scale <= 100),
    lawful_chaotic_scale integer NOT NULL CHECK (lawful_chaotic_scale >= -100 AND lawful_chaotic_scale <= 100),
    alignment_score integer NOT NULL CHECK (alignment_score >= 0 AND alignment_score <= 100),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_character_morality UNIQUE (character_id)
);

-- Grant necessary permissions
GRANT ALL ON character_morality TO anon, authenticated;

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_character_morality_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_character_morality_updated_at
    BEFORE UPDATE ON character_morality
    FOR EACH ROW
    EXECUTE FUNCTION update_character_morality_updated_at(); 