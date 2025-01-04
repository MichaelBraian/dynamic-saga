-- Add new columns to character_specialties
ALTER TABLE character_specialties 
ADD COLUMN IF NOT EXISTS obtained_during_creation boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS obtained_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;

-- Create or replace the handle_specialty_selection function
CREATE OR REPLACE FUNCTION public.handle_specialty_selection(
    p_character_id uuid,
    p_specialty_id uuid,
    p_attribute_modifiers jsonb
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
    v_character_class text;
    v_specialty_class text;
    v_character_status text;
    v_stored_modifiers jsonb;
    v_modified_value integer;
    v_obtained_during_creation boolean;
    v_attr record;
BEGIN
    -- Get character status and class
    SELECT class, status INTO v_character_class, v_character_status
    FROM characters
    WHERE id = p_character_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Character not found';
    END IF;

    -- Get specialty class and modifiers
    SELECT class_type, attribute_modifiers 
    INTO v_specialty_class, v_stored_modifiers
    FROM specialties
    WHERE id = p_specialty_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Specialty not found';
    END IF;

    -- Validate class match
    IF v_character_class != v_specialty_class THEN
        RAISE EXCEPTION 'Selected specialty does not match character class';
    END IF;

    -- Validate modifiers match
    IF p_attribute_modifiers != v_stored_modifiers THEN
        RAISE EXCEPTION 'Provided modifiers do not match specialty definition';
    END IF;

    -- Check attributes exist
    IF (SELECT COUNT(*) FROM character_attributes 
        WHERE character_id = p_character_id) != 6 THEN
        RAISE EXCEPTION 'Character must have all attributes before selecting specialty';
    END IF;

    -- Validate attribute ranges
    FOR v_attr IN 
        SELECT key as attr_name, (value::integer) as modifier 
        FROM jsonb_each_text(p_attribute_modifiers)
    LOOP
        SELECT value + v_attr.modifier INTO v_modified_value
        FROM character_attributes
        WHERE character_id = p_character_id 
        AND attribute_name = v_attr.attr_name;

        IF v_modified_value < 2 OR v_modified_value > 12 THEN
            RAISE EXCEPTION 'Modified attribute value % would be out of range (2-12)', v_attr.attr_name;
        END IF;
    END LOOP;

    -- Determine if this is during character creation
    v_obtained_during_creation := (v_character_status = 'specialty');

    -- Check for existing creation specialty if this is during creation
    IF v_obtained_during_creation THEN
        IF EXISTS (
            SELECT 1 FROM character_specialties
            WHERE character_id = p_character_id
            AND obtained_during_creation = true
        ) THEN
            RAISE EXCEPTION 'Character can only select one specialty during creation';
        END IF;
    END IF;

    -- Insert specialty selection
    INSERT INTO character_specialties (
        character_id,
        specialty_id,
        obtained_during_creation,
        obtained_at
    ) VALUES (
        p_character_id,
        p_specialty_id,
        v_obtained_during_creation,
        CURRENT_TIMESTAMP
    );

    -- Apply attribute modifications
    FOR v_attr IN 
        SELECT key as attr_name, (value::integer) as modifier 
        FROM jsonb_each_text(p_attribute_modifiers)
    LOOP
        UPDATE character_attributes
        SET value = value + v_attr.modifier
        WHERE character_id = p_character_id 
        AND attribute_name = v_attr.attr_name;
    END LOOP;

    -- Update character status if during creation
    IF v_obtained_during_creation THEN
        UPDATE characters
        SET status = 'faith_points'
        WHERE id = p_character_id;
    END IF;
END;
$$; 