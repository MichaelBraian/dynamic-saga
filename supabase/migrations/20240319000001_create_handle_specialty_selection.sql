-- Create the handle_specialty_selection function
CREATE OR REPLACE FUNCTION handle_specialty_selection(
    p_character_id UUID,
    p_specialty_id UUID
)
RETURNS void AS $$
DECLARE
    v_specialty RECORD;
BEGIN
    -- Get the specialty details
    SELECT * INTO v_specialty
    FROM specialties
    WHERE id = p_specialty_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Specialty not found';
    END IF;

    -- Insert or update specialty selection
    INSERT INTO character_specialties (character_id, specialty_id)
    VALUES (p_character_id, p_specialty_id)
    ON CONFLICT (character_id)
    DO UPDATE SET specialty_id = EXCLUDED.specialty_id;

    -- Update character attributes with modifiers
    -- Strength
    UPDATE character_attributes
    SET modifier = v_specialty.strength_bonus
    WHERE character_id = p_character_id AND attribute_name = 'STR';

    -- Dexterity
    UPDATE character_attributes
    SET modifier = v_specialty.dexterity_bonus
    WHERE character_id = p_character_id AND attribute_name = 'DEX';

    -- Constitution
    UPDATE character_attributes
    SET modifier = v_specialty.constitution_bonus
    WHERE character_id = p_character_id AND attribute_name = 'CON';

    -- Intelligence
    UPDATE character_attributes
    SET modifier = v_specialty.intelligence_bonus
    WHERE character_id = p_character_id AND attribute_name = 'INT';

    -- Wisdom
    UPDATE character_attributes
    SET modifier = v_specialty.wisdom_bonus
    WHERE character_id = p_character_id AND attribute_name = 'WIS';

    -- Charisma
    UPDATE character_attributes
    SET modifier = v_specialty.charisma_bonus
    WHERE character_id = p_character_id AND attribute_name = 'CHA';

    -- Update character status
    UPDATE characters
    SET status = 'faith_points'
    WHERE id = p_character_id;

EXCEPTION WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION handle_specialty_selection(UUID, UUID) TO authenticated; 