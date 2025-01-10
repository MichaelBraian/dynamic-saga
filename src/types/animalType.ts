import { z } from 'zod';

export interface AnimalType {
  id: string;
  name: string;
  abilities: string[];
  description: string;
}

export const animalTypeSchema = z.object({
  animalTypeId: z.string({
    required_error: 'Please select an animal form',
    invalid_type_error: 'Invalid animal form selection',
  }).nullable().transform(val => val === '' ? null : val),
});

export type AnimalTypeFormData = z.infer<typeof animalTypeSchema>; 