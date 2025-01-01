import { supabase } from "@/integrations/supabase/client";
import { useCharacterState } from "./useCharacterState";
import { useCharacterOperations } from "./useCharacterOperations";
import { useToast } from "@/hooks/use-toast";

export const useCharacterSelectionHandlers = () => {
  const { updateCharacterState } = useCharacterState();
  const { handleClassSelection } = useCharacterOperations();
  const { toast } = useToast();

  const handleNameSelected = async (newCharacterId: string) => {
    console.log('Handling name selection with ID:', newCharacterId);
    updateCharacterState({
      characterId: newCharacterId,
      currentStep: "gender"
    });
  };

  const handleGenderSelected = async (characterId: string, isTransitioning: boolean) => {
    if (isTransitioning || !characterId) {
      console.log('Cannot handle gender selection: transitioning or no character ID');
      return;
    }
    
    try {
      console.log('Handling gender selection completion');
      
      // Update character status in database
      const { error: updateError } = await supabase
        .from('characters')
        .update({ status: 'race' })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character status:', updateError);
        toast({
          variant: "destructive",
          description: "Failed to proceed to race selection. Please try again.",
        });
        throw updateError;
      }

      // Update UI state
      updateCharacterState({ 
        currentStep: "race"
      });

      toast({
        description: "Proceeding to race selection",
      });
    } catch (error) {
      console.error('Error handling gender selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed. Please try again.",
      });
    }
  };

  const handleRaceSelected = async (characterId: string) => {
    try {
      const { data } = await supabase
        .from('characters')
        .select('race, status')
        .eq('id', characterId)
        .single();
      
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
