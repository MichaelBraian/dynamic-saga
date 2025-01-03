-- Check questions table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'questions';

-- Show all morality questions and their weights
SELECT id, question_text, morality_weight, category
FROM questions
WHERE category = 'morality'
ORDER BY morality_weight; 