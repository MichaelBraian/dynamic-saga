-- Standardize morality calculations across the database
-- This script ensures all calculations match the TypeScript implementation

-- First, verify and update question weights
UPDATE questions
SET morality_weight = 
  CASE 
    WHEN category = 'morality' AND morality_weight > 0 THEN 100  -- Good vs Evil questions
    WHEN category = 'morality' AND morality_weight < 0 THEN -100 -- Law vs Chaos questions
    ELSE morality_weight
  END
WHERE category = 'morality';

-- Recalculate all morality scores using the standardized formula
WITH response_scores AS (
    SELECT 
        cr.character_id,
        q.morality_weight,
        q.id as question_id,
        cr.answer,
        -- Using the same formula as TypeScript: (responseValue - 3) * 50
        ((CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer) - 3) * 50) as scaled_value
    FROM character_responses cr
    JOIN questions q ON q.id = cr.question_id
    WHERE cr.answer ~ '^\d+\.'
),
scores_by_type AS (
    SELECT 
        character_id,
        'good_evil' as type,
        COUNT(*) as num_questions,
        ROUND(AVG(scaled_value)) as avg_score
    FROM response_scores
    WHERE morality_weight > 0
    GROUP BY character_id
    
    UNION ALL
    
    SELECT 
        character_id,
        'lawful_chaotic' as type,
        COUNT(*) as num_questions,
        ROUND(AVG(scaled_value)) as avg_score
    FROM response_scores
    WHERE morality_weight < 0
    GROUP BY character_id
),
aggregated_scores AS (
    SELECT 
        character_id,
        MAX(CASE WHEN type = 'good_evil' THEN avg_score END) as good_evil_scale,
        MAX(CASE WHEN type = 'lawful_chaotic' THEN avg_score END) as lawful_chaotic_scale
    FROM scores_by_type
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

-- Verify the changes
SELECT 
    c.name as character_name,
    cm.good_evil_scale,
    cm.lawful_chaotic_scale,
    cm.alignment_score,
    CASE 
        WHEN cm.good_evil_scale >= 33 THEN 'Good'
        WHEN cm.good_evil_scale <= -33 THEN 'Evil'
        ELSE 'Neutral'
    END || ' ' ||
    CASE 
        WHEN cm.lawful_chaotic_scale >= 33 THEN 'Lawful'
        WHEN cm.lawful_chaotic_scale <= -33 THEN 'Chaotic'
        ELSE 'Neutral'
    END as alignment
FROM characters c
JOIN character_morality cm ON c.id = cm.character_id
ORDER BY c.name;

-- Show detailed calculation for verification
SELECT 
    c.name as character_name,
    q.question_text,
    cr.answer,
    q.morality_weight,
    ((CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer) - 3) * 50) as scaled_value,
    CASE WHEN q.morality_weight > 0 THEN 'Good/Evil' ELSE 'Law/Chaos' END as scale_type
FROM characters c
JOIN character_responses cr ON c.id = cr.character_id
JOIN questions q ON q.id = cr.question_id
WHERE q.category = 'morality'
ORDER BY c.name, q.morality_weight; 