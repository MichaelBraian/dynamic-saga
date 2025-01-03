import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbmqwevifguswnqktnnj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibXF3ZXZpZmd1c3ducWt0bm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MTYzMzYsImV4cCI6MjA1MTE5MjMzNn0.X3vSS_qKndg0P3ZhyIIcSVYcLmD-gLMEzQVj4k0qTdQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPolicies() {
  try {
    // Enable RLS
    const { error: rls_error } = await supabase.rpc('alter_table_enable_rls', {
      table_name: 'character_morality'
    });

    if (rls_error) {
      console.error('Error enabling RLS:', rls_error);
      return;
    }

    // Add SELECT policy
    const { error: select_error } = await supabase.rpc('create_policy', {
      table_name: 'character_morality',
      name: 'Users can view their own character\'s morality',
      operation: 'SELECT',
      expression: 'auth.uid() IN (SELECT user_id FROM characters WHERE id = character_id)'
    });

    if (select_error) {
      console.error('Error adding SELECT policy:', select_error);
      return;
    }

    // Add INSERT policy
    const { error: insert_error } = await supabase.rpc('create_policy', {
      table_name: 'character_morality',
      name: 'Users can insert their own character\'s morality',
      operation: 'INSERT',
      expression: 'auth.uid() IN (SELECT user_id FROM characters WHERE id = character_id)'
    });

    if (insert_error) {
      console.error('Error adding INSERT policy:', insert_error);
      return;
    }

    // Add UPDATE policy
    const { error: update_error } = await supabase.rpc('create_policy', {
      table_name: 'character_morality',
      name: 'Users can update their own character\'s morality',
      operation: 'UPDATE',
      expression: 'auth.uid() IN (SELECT user_id FROM characters WHERE id = character_id)'
    });

    if (update_error) {
      console.error('Error adding UPDATE policy:', update_error);
      return;
    }

    console.log('Successfully added all policies!');
  } catch (error) {
    console.error('Error:', error);
  }
}

addPolicies(); 