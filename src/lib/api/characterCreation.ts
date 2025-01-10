import { supabase } from '../supabase';
import type { Database } from '@/types/supabase';
import { handleAPIError } from './errors';
import { globalRateLimiter } from './rateLimiter';

type Tables = Database['public']['Tables'];

export type CharacterProfile = {
  character_class: string | null;
  character_name: string | null;
  created_at: string;
  gender: string | null;
  id: string;
  race: string | null;
  user_id: string;
  race_details?: Tables['races']['Row'];
  class_details?: Tables['character_classes']['Row'];
  animal_type?: Tables['animal_types']['Row'];
  attributes?: Tables['character_attributes']['Row'];
  equipment?: Array<
    Tables['character_equipment']['Row'] & {
      item: Tables['equipment_items']['Row'];
    }
  >;
};

export class CharacterCreationAPI {
  constructor() {}

  // Race Selection
  async getRaces() {
    try {
      await globalRateLimiter.checkLimit();
      const { data, error } = await supabase
        .from('races')
        .select('*, animal_types(*)');
      
      if (error) throw error;
      return data as (Tables['races']['Row'] & {
        animal_types: Tables['animal_types']['Row'][];
      })[];
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Character Classes
  async getCharacterClasses() {
    try {
      await globalRateLimiter.checkLimit();
      const { data, error } = await supabase
        .from('character_classes')
        .select('*');
      
      if (error) throw error;
      return data as Tables['character_classes']['Row'][];
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Faiths
  async getFaiths() {
    try {
      await globalRateLimiter.checkLimit();
      const { data, error } = await supabase
        .from('faiths')
        .select('*');
      
      if (error) throw error;
      return data as Tables['faiths']['Row'][];
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Backgrounds
  async getBackgrounds() {
    try {
      await globalRateLimiter.checkLimit();
      const { data, error } = await supabase
        .from('backgrounds')
        .select('*');
      
      if (error) throw error;
      return data as Tables['backgrounds']['Row'][];
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Character Profile
  async createCharacterProfile(userId: string, data: Tables['profiles']['Insert']) {
    try {
      await globalRateLimiter.checkLimit();
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({ ...data, user_id: userId })
        .select()
        .single();
      
      if (error) throw error;
      return profile as Tables['profiles']['Row'];
    } catch (error) {
      handleAPIError(error);
    }
  }

  async updateCharacterProfile(
    profileId: string,
    data: Partial<Tables['profiles']['Update']>
  ) {
    try {
      await globalRateLimiter.checkLimit();
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', profileId)
        .select()
        .single();
      
      if (error) throw error;
      return profile as Tables['profiles']['Row'];
    } catch (error) {
      handleAPIError(error);
    }
  }

  async getCharacterProfile(profileId: string): Promise<CharacterProfile | null> {
    try {
      await globalRateLimiter.checkLimit();
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          race_details:races(*),
          class_details:character_classes(*),
          animal_type:animal_types(*),
          attributes:character_attributes(*),
          equipment:character_equipment(*, item:equipment_items(*))
        `)
        .eq('id', profileId)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return data as unknown as CharacterProfile;
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Character Attributes
  async saveCharacterAttributes(
    profileId: string,
    attributes: Omit<Tables['character_attributes']['Insert'], 'profile_id'>
  ) {
    try {
      await globalRateLimiter.checkLimit();
      const { data, error } = await supabase
        .from('character_attributes')
        .upsert({ ...attributes, profile_id: profileId })
        .select()
        .single();
      
      if (error) throw error;
      return data as Tables['character_attributes']['Row'];
    } catch (error) {
      handleAPIError(error);
    }
  }

  // Character Equipment
  async addEquipment(
    profileId: string,
    equipment: Omit<Tables['character_equipment']['Insert'], 'profile_id'>
  ) {
    try {
      await globalRateLimiter.checkLimit();
      const { data, error } = await supabase
        .from('character_equipment')
        .insert({ ...equipment, profile_id: profileId })
        .select('*, item:equipment_items(*)')
        .single();
      
      if (error) throw error;
      return data as Tables['character_equipment']['Row'] & {
        item: Tables['equipment_items']['Row'];
      };
    } catch (error) {
      handleAPIError(error);
    }
  }

  async removeEquipment(equipmentId: string) {
    try {
      await globalRateLimiter.checkLimit();
      const { error } = await supabase
        .from('character_equipment')
        .delete()
        .eq('id', equipmentId);
      
      if (error) throw error;
    } catch (error) {
      handleAPIError(error);
    }
  }

  async updateEquipment(
    equipmentId: string,
    updates: Partial<Tables['character_equipment']['Update']>
  ) {
    try {
      await globalRateLimiter.checkLimit();
      const { data, error } = await supabase
        .from('character_equipment')
        .update(updates)
        .eq('id', equipmentId)
        .select('*, item:equipment_items(*)')
        .single();
      
      if (error) throw error;
      return data as Tables['character_equipment']['Row'] & {
        item: Tables['equipment_items']['Row'];
      };
    } catch (error) {
      handleAPIError(error);
    }
  }
} 