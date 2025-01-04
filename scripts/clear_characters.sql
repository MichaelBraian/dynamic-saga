-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- Delete from dependent tables first
DELETE FROM character_morality;
DELETE FROM character_responses;

-- Then delete from the main table
DELETE FROM characters;

-- Re-enable triggers
SET session_replication_role = 'origin'; 