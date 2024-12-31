export type CharacterStatus = 'naming' | 'gender' | 'race' | 'animal_type' | 'class' | 'questioning' | 'attributes' | 'generated' | 'completed';
export type Gender = 'male' | 'female';
export type Race = 'Human' | 'Dwarf' | 'Animal';
export type Class = 'Barbarian' | 'Bard' | 'Cleric' | 'Druid' | 'Fighter' | 'Monk' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer' | 'Warlock' | 'Wizard' | 'Artificer' | 'Trollslayer' | 'Berserker' | 'Dragon Trainer' | 'Politician';

export interface Character {
  id: string;
  name: string;
  status: CharacterStatus;
  gender?: Gender;
  race?: Race;
  class?: Class;
  animal_type?: string;
  created_at: string;
  updated_at: string;
}