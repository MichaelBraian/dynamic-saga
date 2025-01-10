export type CharacterCreationStep = 
  | 'name'
  | 'gender'
  | 'race'
  | 'animalType'
  | 'class'
  | 'attributes'
  | 'morality'
  | 'faith'
  | 'faithPoints'
  | 'specialties'
  | 'background'
  | 'appearance'
  | 'clothing'
  | 'equipment'
  | 'description'
  | 'characterCard'
  | 'complete'
  | 'generated';

export interface Character {
  id?: string;
  userId: string;
  name: string;
  gender: string;
  pronouns: string;
  raceId: string | null;
  animalTypeId: string | null;
  classId: string | null;
  morality?: {
    lawChaos: number;
    goodEvil: number;
  };
  faith?: {
    deityId: string | null;
    devotionLevel: number;
  };
  faithPoints?: number;
  specialties?: string[];
  background?: {
    story: string;
    traits: string[];
  };
  appearance?: {
    height: string;
    build: string;
    features: string[];
  };
  clothing?: string[];
  equipment?: {
    weapons: string[];
    armor: string[];
    items: string[];
  };
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CharacterFormData extends Omit<Character, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  attributes: Record<string, number>;
}

export interface CharacterValidation {
  name: {
    minLength: number;
    maxLength: number;
    pattern: RegExp;
  };
  attributes: {
    min: number;
    max: number;
    total: number;
  };
} 