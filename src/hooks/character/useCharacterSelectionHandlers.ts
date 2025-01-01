import { supabase } from "@/integrations/supabase/client";
import { useCharacterState } from "./useCharacterState";
import { useCharacterOperations } from "./useCharacterOperations";

export const useCharacterSelectionHandlers = () => {
  const { updateCharacterState } = useCharacterState();
  const { handleClassSelection } = useCharacterOperations();

  const handleNameSelected = (newCharacterId: string) => {
    updateCharacterState({
      characterId: newCharacterId,
      currentStep: "gender"
    });
  };

  const handleGenderSelected = async (characterId: string, isTransitioning: boolean) => {
    if (isTransitioning || !characterId) return;
    
    try {
      updateCharacterState({ currentStep: "race" });
    } catch (error) {
      console.error('Error handling gender selection:', error);
    }
  };

  const handleRaceSelected = async (characterId: string) => {
    try {
      const { data } = await supabase
        .from('characters')
        .select('race, status')
        .eq('id', characterId)
        .maybeSingle();
      
      updateCharacterState({
        currentStep: data?.status || "class",
        selectedRace: data?.race || null
      });
    } catch (error) {
      console.error('Error handling race selection:', error);
    }
  };

  const handleAnimalTypeSelected = (animalType: string) => {
    updateCharacterState({
      currentStep: "class",
      selectedAnimalType: animalType
    });
  };

  const handleClassSelected = async (characterClass: string, characterId: string, selectedRace: string) => {
    if (!characterId || !selectedRace) return;
    
    try {
      const success = await handleClassSelection(characterId, selectedRace, characterClass);
      if (success) {
        updateCharacterState({
          currentStep: "clothing",
          selectedClass: characterClass
        });
      }
    } catch (error) {
      console.error('Error handling class selection:', error);
    }
  };

  const handleClothingSelected = () => {
    updateCharacterState({ currentStep: "armor" });
  };

  const handleArmorSelected = () => {
    updateCharacterState({ currentStep: "morality" });
  };

  return {
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected
  };
};