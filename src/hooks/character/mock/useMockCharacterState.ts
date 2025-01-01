import { useState, useCallback } from "react";
import { CharacterStatus } from "@/types/character";

interface CharacterState {
  characterId: string | null;
  currentStep: CharacterStatus;
  selectedRace: string | null;
  selectedAnimalType: string | null;
  selectedClass: string | null;
  isTransitioning: boolean;
}

export const useMockCharacterState = () => {
  const [state, setState] = useState<CharacterState>({
    characterId: null,
    currentStep: "naming",
    selectedRace: null,
    selectedAnimalType: null,
    selectedClass: null,
    isTransitioning: false,
  });

  const updateState = useCallback((updates: Partial<CharacterState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      console.log('Mock character state updated:', {
        previous: prev,
        updates,
        newState
      });
      return newState;
    });
  }, []);

  const setIsTransitioning = useCallback((isTransitioning: boolean) => {
    updateState({ isTransitioning });
  }, [updateState]);

  return {
    ...state,
    updateState,
    setIsTransitioning
  };
};