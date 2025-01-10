import { create } from 'zustand';
import { CharacterCreationStep } from '@/types/character';

interface CharacterFormState {
  name: string;
  gender: string;
  pronouns: string;
  raceId: string | null;
  animalTypeId: string | null;
}

interface CharacterCreationStore {
  currentStep: CharacterCreationStep;
  formData: CharacterFormState;
  errors: Record<string, string>;
  updateFormData: (data: Partial<CharacterFormState>) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const STEPS: CharacterCreationStep[] = [
  'name',
  'gender',
  'race',
  'animalType',
  'class',
  'attributes',
  'morality',
  'faith',
  'faithPoints',
  'specialties',
  'background',
  'appearance',
  'clothing',
  'equipment',
  'description',
  'characterCard',
  'complete',
  'generated',
];

export const useCharacterCreation = create<CharacterCreationStore>((set, get) => ({
  currentStep: 'name',
  formData: {
    name: '',
    gender: '',
    pronouns: '',
    raceId: null,
    animalTypeId: null,
  },
  errors: {},
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setError: (field, message) =>
    set((state) => ({
      errors: { ...state.errors, [field]: message },
    })),
  clearError: (field) =>
    set((state) => {
      const { [field]: _, ...rest } = state.errors;
      return { errors: rest };
    }),
  goToNextStep: () => {
    const currentIndex = STEPS.indexOf(get().currentStep);
    if (currentIndex < STEPS.length - 1) {
      set({ currentStep: STEPS[currentIndex + 1] });
    }
  },
  goToPreviousStep: () => {
    const currentIndex = STEPS.indexOf(get().currentStep);
    if (currentIndex > 0) {
      set({ currentStep: STEPS[currentIndex - 1] });
    }
  },
  get canGoBack() {
    return STEPS.indexOf(get().currentStep) > 0;
  },
  get canGoForward() {
    return STEPS.indexOf(get().currentStep) < STEPS.length - 1;
  },
})); 