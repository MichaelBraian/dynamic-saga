import { useEffect } from "react";
import { CharacterStatus } from "@/types/character";
import { useCharacterState } from "./character/useCharacterState";
import { useCharacterSteps } from "./character/useCharacterSteps";
import { useCharacterSelectionHandlers } from "./character/useCharacterSelectionHandlers";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCharacterCreation = () => {
  const { toast } = useToast();
  const {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
    setIsTransitioning,
    updateCharacterState
  } = useCharacterState();

  const { handleBack: handleStepBack } = useCharacterSteps();
  const {
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected
  } = useCharacterSelectionHandlers();

  useEffect(() => {
    if (!characterId) return;

    console.log('Setting up character status subscription for:', characterId);
    
    const channel = supabase
      .channel(`character_status_${characterId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'characters',
          filter: `id=eq.${characterId}`,
        },
        (payload: any) => {
          console.log('Character status changed:', payload.new.status);
          const newStatus = payload.new.status as CharacterStatus;
          updateCharacterState({ currentStep: newStatus });
          
          if (newStatus === 'attributes' && currentStep === 'morality') {
            console.log('Transitioning from morality to attributes step');
            window.location.reload();
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up character status subscription');
      void supabase.removeChannel(channel);
    };
  }, [characterId, currentStep, updateCharacterState]);

  const handleBack = async () => {
    if (isTransitioning || !characterId) {
      console.log('Cannot go back: transitioning or no character ID');
      return;
    }

    try {
      await handleStepBack(
        isTransitioning,
        characterId,
        currentStep,
        selectedRace,
        selectedAnimalType,
        selectedClass
      );
    } catch (error) {
      console.error('Error handling back navigation:', error);
      toast({
        variant: "destructive",
        description: "Failed to go back. Please try again.",
      });
    }
  };

  return {
    // State
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
    // Handlers
    handleNameSelected: async (newCharacterId: string) => {
      console.log('Handling name selection with ID:', newCharacterId);
      updateCharacterState({
        characterId: newCharacterId,
        currentStep: 'gender'
      });
      await handleNameSelected(newCharacterId);
    },
    handleGenderSelected: () => handleGenderSelected(characterId!, isTransitioning),
    handleRaceSelected: async (characterId: string) => {
      try {
        await handleRaceSelected(characterId);
      } catch (error) {
        console.error('Error handling race selection:', error);
        toast({
          variant: "destructive",
          description: "Failed to save race selection. Please try again.",
        });
      }
    },
    handleAnimalTypeSelected,
    handleClassSelected: (characterClass: string) => 
      handleClassSelected(characterClass, characterId!, selectedRace!),
    handleClothingSelected,
    handleArmorSelected,
    handleBack,
  };
};