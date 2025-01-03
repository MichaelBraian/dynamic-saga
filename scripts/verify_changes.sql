-- Check updated question weights
SELECT question_text, morality_weight
FROM questions
WHERE category = 'morality'
ORDER BY morality_weight;

-- Check updated character alignments
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