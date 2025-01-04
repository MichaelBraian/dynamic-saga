CREATE OR REPLACE FUNCTION handle_specialty_selection(
  p_character_id uuid,
  p_specialty_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_specialty record;
  v_attr text;
  v_value integer;
BEGIN
  -- Get the specialty details
  SELECT * INTO v_specialty
  FROM specialties
  WHERE id = p_specialty_id;

  -- Insert or update the character_specialties record
  INSERT INTO character_specialties (character_id, specialty_id)
  VALUES (p_character_id, p_specialty_id)
  ON CONFLICT (character_id)
  DO UPDATE SET specialty_id = p_specialty_id;

  -- Update character status
  UPDATE characters
  SET status = 'faith_points'
  WHERE id = p_character_id;

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
    AND attribute = CASE
      WHEN v_attr = 'STR' THEN 'strength'
      WHEN v_attr = 'DEX' THEN 'dexterity'
      WHEN v_attr = 'CON' THEN 'constitution'
      WHEN v_attr = 'INT' THEN 'intelligence'
      WHEN v_attr = 'WIS' THEN 'wisdom'
      WHEN v_attr = 'CHA' THEN 'charisma'
    END;
  END LOOP;
END;
$$; 