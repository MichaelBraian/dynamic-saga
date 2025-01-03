-- Check character_morality table
SELECT COUNT(*) as morality_count FROM character_morality;

-- Show any null values in character_morality
SELECT * FROM character_morality 
WHERE alignment_score IS NULL 
   OR good_evil_scale IS NULL 
   OR lawful_chaotic_scale IS NULL;

-- Check character_responses table
SELECT COUNT(*) as responses_count FROM character_responses;

-- Check questions table
SELECT COUNT(*) as questions_count FROM questions WHERE category = 'morality';

-- Show sample of responses with their questions
SELECT 
    cr.character_id,
    cr.answer,
    q.morality_weight,
    q.category
FROM character_responses cr
LEFT JOIN questions q ON q.id = cr.question_id
LIMIT 5;

-- Show characters with morality scores
SELECT 
    c.id as character_id,
    c.name as character_name,
    cm.good_evil_scale,
    cm.lawful_chaotic_scale,
    cm.alignment_score
FROM characters c
LEFT JOIN character_morality cm ON c.id = cm.character_id
WHERE cm.id IS NOT NULL; 