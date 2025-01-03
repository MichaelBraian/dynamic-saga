-- First verify current weights
SELECT id, SUBSTRING(question_text, 1, 50) as question_preview, morality_weight
FROM questions
WHERE id IN (
    'adcc098c-39cc-4684-b159-edde3d1b381f',
    '6d50e591-4f4c-4e97-ada7-c6f3f6dd98ab',
    'd5851395-007a-49a2-8423-8caa02965f9a',
    '90cfc269-e736-4a48-a921-bbc8e8220c05',
    'b69fe057-533a-4f69-9c6f-e67e88b447bb'
);

-- Update the questions with explicit transaction
BEGIN;

-- Update questions to measure lawful/chaotic alignment
UPDATE questions
SET morality_weight = -100
WHERE id = 'adcc098c-39cc-4684-b159-edde3d1b381f'  -- Magical artifact
   OR id = '6d50e591-4f4c-4e97-ada7-c6f3f6dd98ab'  -- Starving child
   OR id = 'd5851395-007a-49a2-8423-8caa02965f9a'  -- Dragon treasure
   OR id = '90cfc269-e736-4a48-a921-bbc8e8220c05'  -- Rival
   OR id = 'b69fe057-533a-4f69-9c6f-e67e88b447bb'; -- False accusation

-- Verify the updates
SELECT id, SUBSTRING(question_text, 1, 50) as question_preview, morality_weight
FROM questions
WHERE id IN (
    'adcc098c-39cc-4684-b159-edde3d1b381f',
    '6d50e591-4f4c-4e97-ada7-c6f3f6dd98ab',
    'd5851395-007a-49a2-8423-8caa02965f9a',
    '90cfc269-e736-4a48-a921-bbc8e8220c05',
    'b69fe057-533a-4f69-9c6f-e67e88b447bb'
);

COMMIT;

-- Now recalculate the scores
WITH response_scores AS (
    SELECT 
        cr.character_id,
        q.morality_weight,
        q.id as question_id,
        cr.answer,
        CASE 
            WHEN q.morality_weight > 0 THEN 
                -- For good/evil questions: 1=good(100), 4=evil(-100)
                ((5 - CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer)) * 50) - 50
            ELSE 
                -- For lawful/chaotic questions: 1=lawful(100), 4=chaotic(-100)
                ((5 - CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer)) * 50) - 50
        END as scaled_value
    FROM character_responses cr
    JOIN questions q ON q.id = cr.question_id
    WHERE cr.answer ~ '^\d+\.'
),
scores_by_type AS (
    SELECT 
        character_id,
        'good_evil' as type,
        COUNT(*) as num_questions,
        AVG(scaled_value) as avg_score
    FROM response_scores
    WHERE morality_weight > 0
    GROUP BY character_id
    
    UNION ALL
    
    SELECT 
        character_id,
        'lawful_chaotic' as type,
        COUNT(*) as num_questions,
        AVG(scaled_value) as avg_score
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

-- Verify the changes with detailed information
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