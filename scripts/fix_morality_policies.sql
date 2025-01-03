-- Backup existing data
CREATE TABLE IF NOT EXISTS character_morality_backup AS
SELECT * FROM character_morality;

-- Update the schema
ALTER TABLE character_morality
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS alignment_score integer;

-- Fix any null alignment scores in existing records
UPDATE character_morality
SET alignment_score = ROUND((ABS(COALESCE(good_evil_scale, 0)) + ABS(COALESCE(lawful_chaotic_scale, 0))) / 2)
WHERE alignment_score IS NULL;

-- Update column names if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'character_morality' 
               AND column_name = 'good_evil_points') THEN
        ALTER TABLE character_morality 
            RENAME COLUMN good_evil_points TO good_evil_scale;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'character_morality' 
               AND column_name = 'law_chaos_points') THEN
        ALTER TABLE character_morality 
            RENAME COLUMN law_chaos_points TO lawful_chaotic_scale;
    END IF;
END $$;

-- Add constraints
ALTER TABLE character_morality
    DROP CONSTRAINT IF EXISTS character_morality_good_evil_scale_check,
    ADD CONSTRAINT character_morality_good_evil_scale_check 
        CHECK (good_evil_scale >= -100 AND good_evil_scale <= 100);

ALTER TABLE character_morality
    DROP CONSTRAINT IF EXISTS character_morality_lawful_chaotic_scale_check,
    ADD CONSTRAINT character_morality_lawful_chaotic_scale_check 
        CHECK (lawful_chaotic_scale >= -100 AND lawful_chaotic_scale <= 100);

-- Update alignment scores for all records to ensure consistency
UPDATE character_morality
SET 
    alignment_score = ROUND((ABS(COALESCE(good_evil_scale, 0)) + ABS(COALESCE(lawful_chaotic_scale, 0))) / 2);

-- Now add the not-null constraint
ALTER TABLE character_morality
    DROP CONSTRAINT IF EXISTS character_morality_alignment_score_check,
    ALTER COLUMN alignment_score SET NOT NULL,
    ADD CONSTRAINT character_morality_alignment_score_check 
        CHECK (alignment_score >= 0 AND alignment_score <= 100);

-- Create or replace the updated_at trigger
CREATE OR REPLACE FUNCTION update_character_morality_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_character_morality_updated_at ON character_morality;
CREATE TRIGGER update_character_morality_updated_at
    BEFORE UPDATE ON character_morality
    FOR EACH ROW
    EXECUTE FUNCTION update_character_morality_updated_at();

-- Recalculate all morality scores using the new algorithm
WITH response_scores AS (
    SELECT 
        cr.character_id,
        q.morality_weight,
        ((CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer) - 3) * 50) as scaled_value
    FROM character_responses cr
    JOIN questions q ON q.id = cr.question_id
    WHERE cr.answer ~ '^\d+\.'
),
aggregated_scores AS (
    SELECT 
        character_id,
        ROUND(AVG(CASE WHEN morality_weight > 0 THEN scaled_value END)) as good_evil_scale,
        ROUND(AVG(CASE WHEN morality_weight < 0 THEN scaled_value END)) as lawful_chaotic_scale
    FROM response_scores
    GROUP BY character_id
)
UPDATE character_morality cm
SET 
    good_evil_scale = LEAST(GREATEST(COALESCE(agg.good_evil_scale, 0), -100), 100),
    lawful_chaotic_scale = LEAST(GREATEST(COALESCE(agg.lawful_chaotic_scale, 0), -100), 100),
    alignment_score = ROUND((ABS(COALESCE(agg.good_evil_scale, 0)) + ABS(COALESCE(agg.lawful_chaotic_scale, 0))) / 2),
    updated_at = now()
FROM aggregated_scores agg
WHERE cm.character_id = agg.character_id; 