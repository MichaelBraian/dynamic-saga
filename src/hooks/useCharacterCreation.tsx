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
    handleNameSelected: handleNameSelectedBase,
    handleGenderSelected: handleGenderSelectedBase,
    handleRaceSelected: handleRaceSelectedBase,
    handleAnimalTypeSelected: handleAnimalTypeSelectedBase,
    handleClassSelected: handleClassSelectedBase,
    handleClothingSelected: handleClothingSelectedBase,
    handleArmorSelected: handleArmorSelectedBase
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
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up character status subscription');
      void supabase.removeChannel(channel);
    };
  }, [characterId, updateCharacterState]);

  const handleBack = async () => {
    if (isTransitioning || !characterId) {
      console.log('Cannot go back: transitioning or no character ID');
      return;
    }

    try {
      setIsTransitioning(true);
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
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleNameSelected = async (newCharacterId: string) => {
    try {
      setIsTransitioning(true);
      await handleNameSelectedBase(newCharacterId);
      updateCharacterState({
        characterId: newCharacterId,
        currentStep: 'gender'
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
    if (!characterId) return;
    try {
      setIsTransitioning(true);
      await handleGenderSelectedBase(characterId);
      updateCharacterState({ currentStep: 'race' });
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

  const handleRaceSelected = async (characterId: string) => {
    try {
      setIsTransitioning(true);
      await handleRaceSelectedBase(characterId);
    } catch (error) {
      console.error('Error in race selection:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleAnimalTypeSelected = async (animalType: string, characterId: string) => {
    try {
      setIsTransitioning(true);
      await handleAnimalTypeSelectedBase(animalType, characterId);
      updateCharacterState({ selectedAnimalType: animalType });
    } catch (error) {
      console.error('Error in animal type selection:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClassSelected = async (characterClass: string) => {
    if (!characterId || !selectedRace) return;
    try {
      setIsTransitioning(true);
      await handleClassSelectedBase(characterClass, characterId);
      updateCharacterState({ selectedClass: characterClass });
    } catch (error) {
      console.error('Error in class selection:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClothingSelected = async (characterId: string) => {
    try {
      setIsTransitioning(true);
      await handleClothingSelectedBase(characterId);
    } catch (error) {
      console.error('Error in clothing selection:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleArmorSelected = async (characterId: string) => {
    try {
      setIsTransitioning(true);
      await handleArmorSelectedBase(characterId);
    } catch (error) {
      console.error('Error in armor selection:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  return {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
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
