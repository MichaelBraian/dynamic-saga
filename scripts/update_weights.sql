-- Update each question individually to ensure it works
UPDATE questions SET morality_weight = -100 WHERE id = 'adcc098c-39cc-4684-b159-edde3d1b381f';
UPDATE questions SET morality_weight = -100 WHERE id = '6d50e591-4f4c-4e97-ada7-c6f3f6dd98ab';
UPDATE questions SET morality_weight = -100 WHERE id = 'd5851395-007a-49a2-8423-8caa02965f9a';
UPDATE questions SET morality_weight = -100 WHERE id = '90cfc269-e736-4a48-a921-bbc8e8220c05';
UPDATE questions SET morality_weight = -100 WHERE id = 'b69fe057-533a-4f69-9c6f-e67e88b447bb';

-- Verify the updates worked
SELECT id, SUBSTRING(question_text, 1, 50) as question_preview, morality_weight
FROM questions
WHERE id IN (
    'adcc098c-39cc-4684-b159-edde3d1b381f',
    '6d50e591-4f4c-4e97-ada7-c6f3f6dd98ab',
    'd5851395-007a-49a2-8423-8caa02965f9a',
    '90cfc269-e736-4a48-a921-bbc8e8220c05',
    'b69fe057-533a-4f69-9c6f-e67e88b447bb'
); 