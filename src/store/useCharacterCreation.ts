import { create } from 'zustand';
import { CharacterCreationStep } from '@/types/character';

interface CharacterFormState {
  name: string;
  gender: string;
  pronouns: string;
  raceId: string | null;
  animalTypeId: string | null;
  classId: string | null;
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

const SHAPESHIFTER_RACE_ID = '4'; // ID of the Shapeshifter race

export const useCharacterCreation = create<CharacterCreationStore>((set, get) => ({
  currentStep: 'name',
  formData: {
    name: '',
    gender: '',
    pronouns: '',
    raceId: null,
    animalTypeId: null,
    classId: null,
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
      const nextStep = STEPS[currentIndex + 1];
      
      // Skip animal type selection if not a shapeshifter
      if (nextStep === 'animalType' && get().formData.raceId !== SHAPESHIFTER_RACE_ID) {
        set({ currentStep: STEPS[currentIndex + 2] });
      } else {
        set({ currentStep: nextStep });
      }
    }
  },
  goToPreviousStep: () => {
    const currentIndex = STEPS.indexOf(get().currentStep);
    if (currentIndex > 0) {
      const previousStep = STEPS[currentIndex - 1];
      
      // Skip animal type selection if not a shapeshifter
      if (previousStep === 'animalType' && get().formData.raceId !== SHAPESHIFTER_RACE_ID) {
        set({ currentStep: STEPS[currentIndex - 2] });
      } else {
        set({ currentStep: previousStep });
      }
    }
  },
  get canGoBack() {
    const currentIndex = STEPS.indexOf(get().currentStep);
    if (currentIndex <= 0) return false;
    
    // If current step is class and previous would be animalType
    if (get().currentStep === 'class' && get().formData.raceId !== SHAPESHIFTER_RACE_ID) {
      return currentIndex > 1; // Can go back to race
    }
    
    return true;
  },
  get canGoForward() {
    const currentIndex = STEPS.indexOf(get().currentStep);
    return currentIndex < STEPS.length - 1;
  },
})); 