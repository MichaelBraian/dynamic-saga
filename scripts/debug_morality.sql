-- Check if questions were updated correctly
SELECT id, SUBSTRING(question_text, 1, 50) as question_preview, morality_weight
FROM questions
WHERE id IN (
    'adcc098c-39cc-4684-b159-edde3d1b381f',
    '6d50e591-4f4c-4e97-ada7-c6f3f6dd98ab',
    'd5851395-007a-49a2-8423-8caa02965f9a',
    '90cfc269-e736-4a48-a921-bbc8e8220c05',
    'b69fe057-533a-4f69-9c6f-e67e88b447bb'
);

-- Check sample of actual responses for lawful/chaotic questions
WITH sample_responses AS (
    SELECT cr.character_id, cr.answer, q.morality_weight,
           CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer) as numeric_answer,
           ((CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer) - 3) * 50) as scaled_value
    FROM character_responses cr
    JOIN questions q ON q.id = cr.question_id
    WHERE q.morality_weight < 0
    LIMIT 10
)
SELECT * FROM sample_responses;

-- Debug the calculation for one character
WITH response_scores AS (
    SELECT 
        cr.character_id,
        q.morality_weight,
        cr.answer,
        ((CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer) - 3) * 50) as scaled_value
    FROM character_responses cr
    JOIN questions q ON q.id = cr.question_id
    WHERE cr.character_id = 'f01ab50c-89b4-4e79-8a2d-e7e866630e99'  -- Character 'trew' with -68 good/evil
    AND cr.answer ~ '^\d+\.'
),
scores_by_type AS (
    SELECT 
        'good_evil' as type,
        character_id,
        morality_weight,
        answer,
        scaled_value
    FROM response_scores
    WHERE morality_weight > 0
    UNION ALL
    SELECT 
        'lawful_chaotic' as type,
        character_id,
        morality_weight,
        answer,
        scaled_value
    FROM response_scores
    WHERE morality_weight < 0
)
SELECT 
    type,
    COUNT(*) as num_questions,
    AVG(scaled_value) as avg_score,
    STRING_AGG(answer, ', ') as answers
FROM scores_by_type
GROUP BY type, character_id; 