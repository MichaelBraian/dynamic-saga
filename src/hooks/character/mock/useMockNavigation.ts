import { useCallback } from "react";
import { CharacterStatus } from "@/types/character";
import { useToast } from "@/hooks/use-toast";

export const useMockNavigation = (
  updateState: (updates: any) => void,
  setIsTransitioning: (isTransitioning: boolean) => void
) => {
  const { toast } = useToast();

  const getPreviousStep = useCallback((currentStep: CharacterStatus, selectedRace: string | null): CharacterStatus => {
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
  }, []);

  const handleBack = useCallback(async (
    isTransitioning: boolean,
    characterId: string | null,
    currentStep: CharacterStatus,
    selectedRace: string | null,
  ) => {
    if (isTransitioning) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStep = getPreviousStep(currentStep, selectedRace);
      updateState({
        currentStep: newStep,
        characterId: newStep === "naming" ? null : characterId,
      });
    } catch (error) {
      console.error('Error in mock navigation:', error);
      toast({
        variant: "destructive",
        description: "Failed to go back. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  }, [getPreviousStep, setIsTransitioning, updateState, toast]);

  return {
    handleBack
  };
};