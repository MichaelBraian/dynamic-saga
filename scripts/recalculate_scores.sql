-- First, let's see what responses we have for the lawful/chaotic questions
WITH lawful_chaotic_responses AS (
    SELECT 
        c.name as character_name,
        q.question_text,
        cr.answer,
        q.morality_weight
    FROM character_responses cr
    JOIN characters c ON c.id = cr.character_id
    JOIN questions q ON q.id = cr.question_id
    WHERE q.morality_weight < 0
    LIMIT 10
)
SELECT * FROM lawful_chaotic_responses;

-- Now calculate scores with detailed output
WITH response_scores AS (
    SELECT 
        cr.character_id,
        c.name as character_name,
        q.morality_weight,
        q.question_text,
        cr.answer,
        CASE 
            WHEN q.morality_weight > 0 THEN 
                ((5 - CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer)) * 50) - 50
            ELSE 
                ((5 - CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer)) * 50) - 50
        END as scaled_value
    FROM character_responses cr
    JOIN characters c ON c.id = cr.character_id
    JOIN questions q ON q.id = cr.question_id
    WHERE cr.answer ~ '^\d+\.'
),
scores_by_type AS (
    SELECT 
        character_id,
        character_name,
        'good_evil' as type,
        COUNT(*) as num_questions,
        AVG(scaled_value) as avg_score,
        STRING_AGG(CONCAT(SUBSTRING(question_text, 1, 30), ': ', answer), '; ') as responses
    FROM response_scores
    WHERE morality_weight > 0
    GROUP BY character_id, character_name
    
    UNION ALL
    
    SELECT 
        character_id,
        character_name,
        'lawful_chaotic' as type,
        COUNT(*) as num_questions,
        AVG(scaled_value) as avg_score,
        STRING_AGG(CONCAT(SUBSTRING(question_text, 1, 30), ': ', answer), '; ') as responses
    FROM response_scores
    WHERE morality_weight < 0
    GROUP BY character_id, character_name
)
SELECT * FROM scores_by_type
ORDER BY character_name, type; 