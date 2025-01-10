import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing connection to Supabase...\n');
    
    // Test races table
    const { data: races, error: racesError } = await supabase
      .from('races')
      .select('*')
      .limit(1);

    if (racesError) {
      console.error('Error fetching races:', racesError);
    } else {
      console.log('Successfully connected to races table:', races);
    }

    // Test character classes
    const { data: classes, error: classesError } = await supabase
      .from('character_classes')
      .select('*')
      .limit(1);

    if (classesError) {
      console.error('Error fetching character classes:', classesError);
    } else {
      console.log('\nSuccessfully connected to character_classes table:', classes);
    }

    // Test faiths
    const { data: faiths, error: faithsError } = await supabase
      .from('faiths')
      .select('*')
      .limit(1);

    if (faithsError) {
      console.error('Error fetching faiths:', faithsError);
    } else {
      console.log('\nSuccessfully connected to faiths table:', faiths);
    }

  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

// Run the test
testConnection(); 