import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

const supabaseUrl = 'https://iqxvxvxdnbqmppmrmrm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeHZ4dnhkbmJxbXBwbXJtbXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ5MjY5NzAsImV4cCI6MjAyMDUwMjk3MH0.7YQXD3xRhTq0Qj0Zk_YFwXM9lEYvJpBkN4I_1QnlXX4';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function deleteAllCharacters() {
  try {
    console.log('Starting deletion of all character data...');

    // First delete from character_morality (dependent table)
    const { error: moralityError } = await supabase
      .from('character_morality')
      .delete()
      .neq('character_id', '00000000-0000-0000-0000-000000000000');

    if (moralityError) {
      throw new Error(`Error deleting character morality: ${moralityError.message}`);
    }
    console.log('Deleted all character morality data');

    // Then delete from character_responses (dependent table)
    const { error: responsesError } = await supabase
      .from('character_responses')
      .delete()
      .neq('character_id', '00000000-0000-0000-0000-000000000000');

    if (responsesError) {
      throw new Error(`Error deleting character responses: ${responsesError.message}`);
    }
    console.log('Deleted all character responses');

    // Finally delete from characters (main table)
    const { error: charactersError } = await supabase
      .from('characters')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (charactersError) {
      throw new Error(`Error deleting characters: ${charactersError.message}`);
    }
    console.log('Deleted all characters');

    console.log('Successfully deleted all character data!');
    process.exit(0);
  } catch (error) {
    console.error('Error during deletion:', error);
    process.exit(1);
  }
}

// Execute the deletion
deleteAllCharacters(); 