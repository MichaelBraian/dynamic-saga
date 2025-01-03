-- Add clothing_type column to characters table
ALTER TABLE characters ADD COLUMN IF NOT EXISTS clothing_type text;

-- Update character_status enum to remove armor
ALTER TYPE character_status DROP VALUE IF EXISTS 'armor'; 