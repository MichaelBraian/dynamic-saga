import { CharacterStatus } from "@/types/character";
import { useCharacterDatabase } from "./useCharacterDatabase";
import { useToast } from "@/hooks/use-toast";

export const useCharacterNavigation = () => {
  const { updateCharacterStatus, toast } = useCharacterDatabase();

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

  const handleNavigation = async (
    characterId: string | null,
    newStatus: CharacterStatus,
    onSuccess: () => void
  ) => {
    if (!characterId) {
      toast({
        variant: "destructive",
        description: "Character ID is missing. Please try again.",
      });
      return;
    }

    try {
      console.log(`Navigating to ${newStatus} for character ${characterId}`);
      await updateCharacterStatus(characterId, newStatus);
      onSuccess();
      toast({
        description: `Successfully moved to ${newStatus} step`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error('Error navigating:', error);
      toast({
        variant: "destructive",
        description: "Failed to update character status. Please try again.",
      });
    }
  };

  return {
    getPreviousStep,
    handleNavigation
  };
};