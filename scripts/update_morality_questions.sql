-- First, backup the questions table
CREATE TABLE IF NOT EXISTS questions_backup AS
SELECT * FROM questions;

-- Update questions to include lawful/chaotic measurements
UPDATE questions
SET morality_weight = -100
WHERE id = 'adcc098c-39cc-4684-b159-edde3d1b381f';  -- Magical artifact question becomes lawful/chaotic

UPDATE questions
SET morality_weight = -100
WHERE id = '6d50e591-4f4c-4e97-ada7-c6f3f6dd98ab';  -- Starving child question becomes lawful/chaotic

UPDATE questions
SET morality_weight = -100
WHERE id = 'd5851395-007a-49a2-8423-8caa02965f9a';  -- Dragon treasure question becomes lawful/chaotic

UPDATE questions
SET morality_weight = -100
WHERE id = '90cfc269-e736-4a48-a921-bbc8e8220c05';  -- Rival question becomes lawful/chaotic

UPDATE questions
SET morality_weight = -100
WHERE id = 'b69fe057-533a-4f69-9c6f-e67e88b447bb';  -- False accusation question becomes lawful/chaotic

-- Recalculate morality scores with the updated weights
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