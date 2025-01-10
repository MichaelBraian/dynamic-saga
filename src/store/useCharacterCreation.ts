import { create } from 'zustand';
import { CharacterCreationStep, CharacterFormData } from '@/types/character';

interface CharacterCreationState {
  currentStep: CharacterCreationStep;
  formData: Partial<CharacterFormData>;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

interface CharacterCreationStore extends CharacterCreationState {
  setStep: (step: CharacterCreationStep) => void;
  updateFormData: (data: Partial<CharacterFormData>) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  reset: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

const initialState: CharacterCreationState = {
  currentStep: 'name',
  formData: {},
  isSubmitting: false,
  errors: {},
};

export const useCharacterCreation = create<CharacterCreationStore>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  
  updateFormData: (data) =>
    set((state) => ({
      ...state,
      formData: { ...state.formData, ...data },
    })),
    
  setError: (field, message) =>
    set((state) => ({
      ...state,
      errors: { ...state.errors, [field]: message },
    })),
    
  clearError: (field) =>
    set((state) => {
      const { [field]: _, ...rest } = state.errors;
      return { ...state, errors: rest };
    }),
    
  reset: () => set(initialState),
  
  setSubmitting: (isSubmitting) => set((state) => ({ ...state, isSubmitting })),
})); 