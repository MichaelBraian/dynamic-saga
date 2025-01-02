-- Create the handle_specialty_selection function
CREATE OR REPLACE FUNCTION handle_specialty_selection(
    p_character_id UUID,
    p_specialty_id UUID,
    p_attribute_modifiers JSONB
)
RETURNS void AS $$
BEGIN
    -- Update character status
    UPDATE characters
    SET status = 'faith_points'
    WHERE id = p_character_id;

    -- Apply attribute modifiers to character_attributes
    UPDATE character_attributes
    SET 
        strength = strength + COALESCE((p_attribute_modifiers->>'STR')::integer, 0),
        dexterity = dexterity + COALESCE((p_attribute_modifiers->>'DEX')::integer, 0),
        constitution = constitution + COALESCE((p_attribute_modifiers->>'CON')::integer, 0),
        intelligence = intelligence + COALESCE((p_attribute_modifiers->>'INT')::integer, 0),
        wisdom = wisdom + COALESCE((p_attribute_modifiers->>'WIS')::integer, 0),
        charisma = charisma + COALESCE((p_attribute_modifiers->>'CHA')::integer, 0)
    WHERE character_id = p_character_id;

    -- Insert specialty selection into character_specialties
    INSERT INTO character_specialties (character_id, specialty_id)
    VALUES (p_character_id, p_specialty_id);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION handle_specialty_selection(UUID, UUID, JSONB) TO authenticated; 