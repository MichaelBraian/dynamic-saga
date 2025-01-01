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

export const useMockState = () => {
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
      console.log('Mock state updated:', {
        previous: prev,
        updates,
        newState
      });
      return newState;
    });
  }, []);

  const setIsTransitioning = useCallback((isTransitioning: boolean) => {
    console.log('Mock transition state updated:', { isTransitioning });
    updateState({ isTransitioning });
  }, [updateState]);

  return {
    ...state,
    updateState,
    setIsTransitioning
  };
};