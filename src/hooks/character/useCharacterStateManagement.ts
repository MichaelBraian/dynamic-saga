import { useState, useCallback } from "react";
import { CharacterStatus } from "@/types/character";
import { useToast } from "@/hooks/use-toast";

interface CharacterState {
  characterId: string | null;
  currentStep: CharacterStatus;
  selectedRace: string | null;
  selectedAnimalType: string | null;
  selectedClass: string | null;
  isTransitioning: boolean;
}

export const useCharacterStateManagement = () => {
  const [state, setState] = useState<CharacterState>({
    characterId: null,
    currentStep: "naming",
    selectedRace: null,
    selectedAnimalType: null,
    selectedClass: null,
    isTransitioning: false,
  });
  
  const { toast } = useToast();

  const updateCharacterState = useCallback((updates: Partial<CharacterState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      console.log('Character state updated:', {
        previous: prev,
        updates,
        newState
      });
      return newState;
    });
  }, []);

  const setIsTransitioning = useCallback((isTransitioning: boolean) => {
    console.log('Transition state updated:', { isTransitioning });
    updateCharacterState({ isTransitioning });
  }, [updateCharacterState]);

  return {
    ...state,
    setIsTransitioning,
    updateCharacterState,
    toast
  };
};