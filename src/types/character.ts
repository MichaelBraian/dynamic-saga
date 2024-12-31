export type CharacterStatus = 'naming' | 'gender' | 'race' | 'questioning' | 'attributes' | 'generated' | 'completed';
export type Gender = 'male' | 'female';
export type Race = 'Human' | 'Dwarf' | 'Animal';

export interface Character {
  id: string;
  name: string;
  status: CharacterStatus;
  gender?: Gender;
  race?: Race;
  created_at: string;
  updated_at: string;
}