CREATE OR REPLACE FUNCTION handle_specialty_selection(
  p_character_id UUID,
  p_specialty_id UUID,
  p_attribute_modifiers JSONB
)
RETURNS void AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Insert or update specialty
    INSERT INTO character_specialties (character_id, specialty_id)
    VALUES (p_character_id, p_specialty_id)
    ON CONFLICT (character_id)
    DO UPDATE SET specialty_id = EXCLUDED.specialty_id;

    -- Update attributes with modifiers
    UPDATE character_attributes ca
    SET value = ca.value + COALESCE((p_attribute_modifiers->ca.attribute_name)::int, 0)
    WHERE ca.character_id = p_character_id;

    -- Update character status
    UPDATE characters
    SET status = 'faith_points'
    WHERE id = p_character_id;

    -- Commit transaction
    COMMIT;
  EXCEPTION WHEN OTHERS THEN
    -- Rollback on any error
    ROLLBACK;
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION handle_specialty_selection(UUID, UUID, JSONB) TO authenticated; 