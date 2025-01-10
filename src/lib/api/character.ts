import { supabase } from '../supabase';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];

export const characterApi = {
  // Profile Management
  profiles: {
    create: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert({ user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    get: async (profileId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          race:races(*),
          class:character_classes(*),
          animal_type:animal_types(*),
          attributes:character_attributes(*),
          morality:morality_alignments(*),
          faith:character_faiths(*, faith:faiths(*)),
          specialties:character_specialties(*, specialty:specialties(*)),
          background:character_backgrounds(*, background:backgrounds(*)),
          equipment:character_equipment(*, item:equipment_items(*))
        `)
        .eq('id', profileId)
        .single();
      if (error) throw error;
      return data;
    },
    update: async (profileId: string, updates: Partial<Tables['profiles']['Update']>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Reference Data
  races: {
    list: async () => {
      const { data, error } = await supabase
        .from('races')
        .select('*, animal_types(*)');
      if (error) throw error;
      return data;
    },
  },

  classes: {
    list: async () => {
      const { data, error } = await supabase
        .from('character_classes')
        .select('*, specialties(*)');
      if (error) throw error;
      return data;
    },
  },

  // Character Attributes
  attributes: {
    create: async (profileId: string, attributes: Omit<Tables['character_attributes']['Insert'], 'id' | 'profile_id'>) => {
      const { data, error } = await supabase
        .from('character_attributes')
        .insert({ ...attributes, profile_id: profileId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (profileId: string, updates: Partial<Tables['character_attributes']['Update']>) => {
      const { data, error } = await supabase
        .from('character_attributes')
        .update(updates)
        .eq('profile_id', profileId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Morality
  morality: {
    create: async (profileId: string, alignment: Omit<Tables['morality_alignments']['Insert'], 'id' | 'profile_id'>) => {
      const { data, error } = await supabase
        .from('morality_alignments')
        .insert({ ...alignment, profile_id: profileId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (profileId: string, updates: Partial<Tables['morality_alignments']['Update']>) => {
      const { data, error } = await supabase
        .from('morality_alignments')
        .update(updates)
        .eq('profile_id', profileId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Faith
  faiths: {
    list: async () => {
      const { data, error } = await supabase
        .from('faiths')
        .select('*');
      if (error) throw error;
      return data;
    },
    assign: async (profileId: string, faithData: Omit<Tables['character_faiths']['Insert'], 'id' | 'profile_id'>) => {
      const { data, error } = await supabase
        .from('character_faiths')
        .insert({ ...faithData, profile_id: profileId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (profileId: string, updates: Partial<Tables['character_faiths']['Update']>) => {
      const { data, error } = await supabase
        .from('character_faiths')
        .update(updates)
        .eq('profile_id', profileId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Specialties
  specialties: {
    list: async (classId: string) => {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .eq('class_id', classId);
      if (error) throw error;
      return data;
    },
    assign: async (profileId: string, specialtyId: string) => {
      const { data, error } = await supabase
        .from('character_specialties')
        .insert({ profile_id: profileId, specialty_id: specialtyId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Backgrounds
  backgrounds: {
    list: async () => {
      const { data, error } = await supabase
        .from('backgrounds')
        .select('*');
      if (error) throw error;
      return data;
    },
    assign: async (profileId: string, backgroundData: Omit<Tables['character_backgrounds']['Insert'], 'id' | 'profile_id'>) => {
      const { data, error } = await supabase
        .from('character_backgrounds')
        .insert({ ...backgroundData, profile_id: profileId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (profileId: string, updates: Partial<Tables['character_backgrounds']['Update']>) => {
      const { data, error } = await supabase
        .from('character_backgrounds')
        .update(updates)
        .eq('profile_id', profileId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },

  // Equipment
  equipment: {
    list: async () => {
      const { data, error } = await supabase
        .from('equipment_items')
        .select('*');
      if (error) throw error;
      return data;
    },
    assign: async (profileId: string, itemId: string, quantity: number = 1) => {
      const { data, error } = await supabase
        .from('character_equipment')
        .insert({ profile_id: profileId, item_id: itemId, quantity })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Tables['character_equipment']['Update']>) => {
      const { data, error } = await supabase
        .from('character_equipment')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    remove: async (id: string) => {
      const { error } = await supabase
        .from('character_equipment')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },
}; 