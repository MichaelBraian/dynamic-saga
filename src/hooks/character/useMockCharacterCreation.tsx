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

export const useMockCharacterCreation = () => {
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

  const handleNameSelected = async (newCharacterId: string) => {
    try {
      setIsTransitioning(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateCharacterState({
        characterId: newCharacterId,
        currentStep: "gender"
      });
      
      toast({
        description: "Character created successfully",
      });
    } catch (error) {
      console.error('Error in name selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to create character. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleGenderSelected = async () => {
    if (!state.characterId) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateCharacterState({ currentStep: "race" });
      
      toast({
        description: "Gender selected successfully",
      });
    } catch (error) {
      console.error('Error in gender selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save gender. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleRaceSelected = async () => {
    if (!state.characterId) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateCharacterState({ currentStep: "class" });
      
      toast({
        description: "Race selected successfully",
      });
    } catch (error) {
      console.error('Error in race selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save race. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleAnimalTypeSelected = async (animalType: string) => {
    if (!state.characterId) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateCharacterState({
        selectedAnimalType: animalType,
        currentStep: "class"
      });
      
      toast({
        description: "Animal type selected successfully",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClassSelected = async (characterClass: string) => {
    if (!state.characterId) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateCharacterState({
        selectedClass: characterClass,
        currentStep: "clothing"
      });
      
      toast({
        description: "Class selected successfully",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClothingSelected = async () => {
    if (!state.characterId) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateCharacterState({ currentStep: "armor" });
      
      toast({
        description: "Clothing selected successfully",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleArmorSelected = async () => {
    if (!state.characterId) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateCharacterState({ currentStep: "morality" });
      
      toast({
        description: "Armor selected successfully",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleBack = async () => {
    if (state.isTransitioning || !state.characterId) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStep = getPreviousStep(state.currentStep, state.selectedRace);
      updateCharacterState({
        currentStep: newStep,
        characterId: newStep === "naming" ? null : state.characterId,
        selectedRace: newStep === "race" ? null : state.selectedRace,
        selectedAnimalType: newStep === "animal_type" ? null : state.selectedAnimalType,
        selectedClass: newStep === "class" ? null : state.selectedClass
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const getPreviousStep = (currentStep: CharacterStatus, selectedRace: string | null): CharacterStatus => {
    switch (currentStep) {
      case "gender":
        return "naming";
      case "race":
        return "gender";
      case "animal_type":
        return "race";
      case "class":
        return selectedRace === 'Animal' ? "animal_type" : "race";
      case "clothing":
        return "class";
      case "armor":
        return "clothing";
      case "morality":
        return "armor";
      case "attributes":
        return "morality";
      default:
        return "naming";
    }
  };

  return {
    ...state,
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected,
    handleBack,
  };
};