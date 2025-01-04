CREATE OR REPLACE FUNCTION handle_specialty_selection(
    p_character_id UUID,
    p_specialty_id UUID
)
RETURNS void AS $$
DECLARE
    v_specialty RECORD;
    v_attr text;
    v_value integer;
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

    -- Reset all modifiers to 0
    UPDATE character_attributes
    SET modifier = 0
    WHERE character_id = p_character_id;

    -- Apply the new modifiers
    FOR v_attr, v_value IN
        SELECT key::text, value::integer
        FROM jsonb_each(v_specialty.attribute_modifiers)
    LOOP
        UPDATE character_attributes
        SET modifier = v_value
        WHERE character_id = p_character_id
        AND attribute_name = CASE
            WHEN v_attr = 'STR' THEN 'STR'
            WHEN v_attr = 'DEX' THEN 'DEX'
            WHEN v_attr = 'CON' THEN 'CON'
            WHEN v_attr = 'INT' THEN 'INT'
            WHEN v_attr = 'WIS' THEN 'WIS'
            WHEN v_attr = 'CHA' THEN 'CHA'
        END;
    END LOOP;

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