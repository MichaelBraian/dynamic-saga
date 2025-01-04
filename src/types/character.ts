import { Database } from "@/integrations/supabase/types";

// Character status enum matching the database
export type CharacterStatus = 'naming' | 'questioning' | 'attributes' | 'specialty' | 'faith_points' | 'generated' | 'completed' | 'class' | 'gender' | 'race' | 'animal_type' | 'clothing' | 'morality';

// Gender type with database constraint
export type Gender = 'male' | 'female';

// Race type with database constraint
export type Race = 'Human' | 'Dwarf' | 'Animal';

// Class type
export type Class = 'Barbarian' | 'Bard' | 'Cleric' | 'Druid' | 'Fighter' | 'Monk' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer' | 'Warlock' | 'Wizard' | 'Artificer' | 'Trollslayer' | 'Berserker' | 'Dragon Trainer' | 'Politician';

// Character interface matching database schema
export interface Character {
  id: string;
  name: string;
  status: CharacterStatus;
  gender?: Gender;
  race?: Race;
  class?: Class;
  animal_type?: string;
  clothing_type?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  has_rolled_attributes: boolean;
  has_rolled_faith_points: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  class_type: string;
  attribute_modifiers: Record<string, number>;
  created_at: string;
}

// Export database types for direct database operations
export type { Database } from "@/integrations/supabase/types";
export type CharacterRow = Database["public"]["Tables"]["characters"]["Row"];
export type CharacterInsert = Database["public"]["Tables"]["characters"]["Insert"];
export type CharacterUpdate = Database["public"]["Tables"]["characters"]["Update"];