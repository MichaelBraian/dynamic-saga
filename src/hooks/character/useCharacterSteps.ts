import { CharacterStatus } from "@/types/character";
import { useCharacterState } from "./useCharacterState";
import { useCharacterNavigation } from "./useCharacterNavigation";
import { useToast } from "@/hooks/use-toast";

export const useCharacterSteps = () => {
  const { updateCharacterState, toast } = useCharacterState();
  const { getPreviousStep, handleNavigation } = useCharacterNavigation();

  const handleBack = async (
    isTransitioning: boolean,
    characterId: string | null,
    currentStep: CharacterStatus,
    selectedRace: string | null,
    selectedAnimalType: string | null,
    selectedClass: string | null
  ) => {
    if (isTransitioning || !characterId) return;
    
    try {
      const newStatus = getPreviousStep(currentStep, selectedRace);
      
      if (characterId) {
        await handleNavigation(characterId, newStatus, () => {
          updateCharacterState({
            characterId: newStatus === "naming" ? null : characterId,
            currentStep: newStatus,
            selectedRace: newStatus === "race" ? null : selectedRace,
            selectedAnimalType: newStatus === "animal_type" ? null : selectedAnimalType,
            selectedClass: newStatus === "class" ? null : selectedClass
          });
        });
      }
    } catch (error) {
      console.error('Error handling back navigation:', error);
      toast({
        variant: "destructive",
        description: "Failed to go back. Please try again.",
      });
    }
  };

  return {
    handleBack
  };
};