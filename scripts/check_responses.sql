-- Get a sample character's responses with question details
WITH sample_character AS (
    SELECT id, name 
    FROM characters 
    WHERE id = 'f01ab50c-89b4-4e79-8a2d-e7e866630e99'  -- This is the character with -68 good/evil score
)
SELECT 
    c.name as character_name,
    q.question_text,
    q.morality_weight,
    cr.answer,
    CAST(SUBSTRING(cr.answer FROM '^(\d+)\.') AS integer) as numeric_answer
FROM sample_character c
JOIN character_responses cr ON c.id = cr.character_id
JOIN questions q ON q.id = cr.question_id
ORDER BY q.morality_weight; 