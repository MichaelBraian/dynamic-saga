-- Create morality_alignments table if it doesn't exist
CREATE TABLE IF NOT EXISTS morality_alignments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    moral_axis text NOT NULL CHECK (moral_axis IN ('good', 'neutral', 'evil')),
    ethical_axis text NOT NULL CHECK (ethical_axis IN ('lawful', 'neutral', 'chaotic')),
    effects jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create calculate_alignment function
CREATE OR REPLACE FUNCTION calculate_alignment(
    p_good_evil integer,
    p_law_chaos integer
) RETURNS TABLE (
    moral_axis text,
    ethical_axis text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN p_good_evil >= 50 THEN 'good'
            WHEN p_good_evil <= -50 THEN 'evil'
            ELSE 'neutral'
        END as moral_axis,
        CASE 
            WHEN p_law_chaos >= 50 THEN 'lawful'
            WHEN p_law_chaos <= -50 THEN 'chaotic'
            ELSE 'neutral'
        END as ethical_axis;
END;
$$ LANGUAGE plpgsql;

-- Insert basic alignments if they don't exist
INSERT INTO morality_alignments (name, description, moral_axis, ethical_axis, effects)
VALUES 
    ('Lawful Good', 'A noble and righteous character who follows rules and traditions while helping others.', 'good', 'lawful', '{"bonus": {"diplomacy": 2, "healing": 1}}'),
    ('Neutral Good', 'A benevolent character who helps others without strict adherence to laws.', 'good', 'neutral', '{"bonus": {"empathy": 2, "healing": 1}}'),
    ('Chaotic Good', 'A free spirit who follows their heart to help others, regardless of rules.', 'good', 'chaotic', '{"bonus": {"creativity": 2, "inspiration": 1}}'),
    ('Lawful Neutral', 'A character who believes in order and follows rules without moral preference.', 'neutral', 'lawful', '{"bonus": {"discipline": 2, "defense": 1}}'),
    ('True Neutral', 'A balanced character who maintains equilibrium between extremes.', 'neutral', 'neutral', '{"bonus": {"adaptability": 2, "perception": 1}}'),
    ('Chaotic Neutral', 'An unpredictable character who values personal freedom above all.', 'neutral', 'chaotic', '{"bonus": {"deception": 2, "stealth": 1}}'),
    ('Lawful Evil', 'A methodical character who uses rules and order for personal gain.', 'evil', 'lawful', '{"bonus": {"intimidation": 2, "control": 1}}'),
    ('Neutral Evil', 'A selfish character who pursues their desires without regard for others.', 'evil', 'neutral', '{"bonus": {"manipulation": 2, "stealth": 1}}'),
    ('Chaotic Evil', 'A destructive character who revels in chaos and causing harm.', 'evil', 'chaotic', '{"bonus": {"destruction": 2, "fear": 1}}')
ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON morality_alignments TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_alignment TO anon, authenticated; 