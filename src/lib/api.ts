import { supabase } from './supabase';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];

export const api = {
  users: {
    get: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .single();
      if (error) throw error;
      return data as Tables['users']['Row'];
    },
    update: async (updates: Partial<Tables['users']['Update']>) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .select()
        .single();
      if (error) throw error;
      return data as Tables['users']['Row'];
    },
  },

  characters: {
    list: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Tables['characters']['Row'][];
    },
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('characters')
        .select('*, character_progress(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return {
        ...data,
        character_progress: data.character_progress[0] || null
      } as Tables['characters']['Row'] & {
        character_progress: Tables['character_progress']['Row'] | null;
      };
    },
    create: async (character: Tables['characters']['Insert']) => {
      const { data, error } = await supabase
        .from('characters')
        .insert(character)
        .select()
        .single();
      if (error) throw error;
      return data as Tables['characters']['Row'];
    },
    update: async (id: string, updates: Partial<Tables['characters']['Update']>) => {
      const { data, error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Tables['characters']['Row'];
    },
    delete: async (id: string) => {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  characterProgress: {
    get: async (characterId: string) => {
      const { data, error } = await supabase
        .from('character_progress')
        .select('*')
        .eq('character_id', characterId)
        .single();
      if (error) throw error;
      return data as Tables['character_progress']['Row'];
    },
    create: async (progress: Tables['character_progress']['Insert']) => {
      const { data, error } = await supabase
        .from('character_progress')
        .insert(progress)
        .select()
        .single();
      if (error) throw error;
      return data as Tables['character_progress']['Row'];
    },
    update: async (
      characterId: string,
      updates: Partial<Tables['character_progress']['Update']>
    ) => {
      const { data, error } = await supabase
        .from('character_progress')
        .update(updates)
        .eq('character_id', characterId)
        .select()
        .single();
      if (error) throw error;
      return data as Tables['character_progress']['Row'];
    },
  },
}; 