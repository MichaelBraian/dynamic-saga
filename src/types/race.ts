import { z } from 'zod';

export interface Race {
  id: string;
  name: string;
  description: string;
  abilities: string[];
  available_animal_types: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface RaceWithAnimalTypes extends Race {
  animal_types: Array<{
    id: string;
    name: string;
    abilities: string[];
    description: string;
  }>;
}

export const raceSchema = z.object({
  raceId: z.string({
    required_error: 'Please select a race',
    invalid_type_error: 'Invalid race selection',
  }),
});

export type RaceFormData = z.infer<typeof raceSchema>; 