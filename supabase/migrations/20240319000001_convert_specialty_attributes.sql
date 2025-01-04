-- First, create a backup of current data
CREATE TABLE IF NOT EXISTS specialties_backup AS SELECT * FROM specialties;

-- Convert all existing specialties to use three-letter codes
UPDATE specialties 
SET attribute_modifiers = (
  SELECT jsonb_object_agg(
    CASE key
      WHEN 'strength' THEN 'STR'
      WHEN 'dexterity' THEN 'DEX'
      WHEN 'constitution' THEN 'CON'
      WHEN 'intelligence' THEN 'INT'
      WHEN 'wisdom' THEN 'WIS'
      WHEN 'charisma' THEN 'CHA'
      ELSE key
    END,
    value
  )
  FROM jsonb_each(specialties.attribute_modifiers) AS fields(key, value)
); 