import { z } from 'zod';

export interface CharacterClass {
  id: string;
  name: string;
  overview: string;
  traits: string[];
}

export interface ClassWithSpecialties extends CharacterClass {
  specialties: Array<{
    id: string;
    name: string;
    description: string;
    abilities: string[];
  }>;
}

export const classSchema = z.object({
  classId: z.string({
    required_error: 'Please select a class',
    invalid_type_error: 'Invalid class selection',
  }),
});

export type ClassFormData = z.infer<typeof classSchema>; 