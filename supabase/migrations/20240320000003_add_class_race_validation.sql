-- Add class column if it doesn't exist
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS class text;

-- Create a function to validate race-class combinations
CREATE OR REPLACE FUNCTION validate_race_class_combination()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate Trollslayer can only be chosen by Dwarfs
  IF NEW.class = 'Trollslayer' AND NEW.race != 'Dwarf' THEN
    RAISE EXCEPTION 'Trollslayer class is only available to Dwarfs';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to validate race-class combinations
CREATE TRIGGER validate_race_class
  BEFORE INSERT OR UPDATE ON characters
  FOR EACH ROW
  WHEN (NEW.class IS NOT NULL AND NEW.race IS NOT NULL)
  EXECUTE FUNCTION validate_race_class_combination();

-- Add a comment to explain the constraint
COMMENT ON TRIGGER validate_race_class ON characters IS 'Ensures valid race-class combinations (e.g., Trollslayer only for Dwarfs)'; 