import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { useCharacterState } from "./character/useCharacterState";
import { useCharacterDatabase } from "./character/useCharacterDatabase";
import { useCharacterNavigation } from "./character/useCharacterNavigation";

export const useCharacterCreation = () => {
  const {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
    setIsTransitioning,
    updateCharacterState,
    toast
  } = useCharacterState();

  const { verifyCharacterOwnership } = useCharacterDatabase();
  const { getPreviousStep, handleNavigation } = useCharacterNavigation();

  useEffect(() => {
    if (!characterId) return;

    console.log('Setting up real-time subscription for character:', characterId);
    
    const channel = supabase
      .channel('character_status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'characters',
          filter: `id=eq.${characterId}`,
        },
        (payload: any) => {
          console.log('Character status updated:', payload.new.status);
          if (payload.new && payload.new.status) {
            updateCharacterState({ currentStep: payload.new.status as CharacterStatus });
          }
        }
      )
      .subscribe();

    const fetchCharacter = async () => {
      try {
        const character = await verifyCharacterOwnership(characterId);
        updateCharacterState({
          characterId,
          currentStep: character.status,
          selectedRace: character.race || null,
          selectedAnimalType: character.animal_type || null,
          selectedClass: character.class || null
        });
      } catch (error) {
        console.error('Error fetching character:', error);
        toast({
          variant: "destructive",
          description: "Failed to load character data. Please try again.",
        });
      }
    };

    fetchCharacter();

    return () => {
      console.log('Cleaning up character status subscription');
      supabase.removeChannel(channel);
    };
  }, [characterId]);

  const handleNameSelected = (newCharacterId: string) => {
    updateCharacterState({
      characterId: newCharacterId,
      currentStep: "gender"
    });
  };

  const handleGenderSelected = async () => {
    if (isTransitioning || !characterId) return;
    setIsTransitioning(true);
    
    await handleNavigation(characterId, "race", () => {
      updateCharacterState({ currentStep: "race" });
    });
    
    setIsTransitioning(false);
  };

  const handleRaceSelected = async () => {
    if (isTransitioning || !characterId) return;
    setIsTransitioning(true);
    
    try {
      const { data } = await supabase
        .from('characters')
        .select('race, status')
        .eq('id', characterId)
        .maybeSingle();
      
      updateCharacterState({
        currentStep: data?.status as CharacterStatus || "class",
        selectedRace: data?.race || null
      });
    } catch (error) {
      console.error('Error handling race selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save race selection. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleAnimalTypeSelected = (animalType: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      updateCharacterState({
        currentStep: "class",
        selectedAnimalType: animalType
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClassSelected = (characterClass: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      updateCharacterState({
        currentStep: "clothing",
        selectedClass: characterClass
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClothingSelected = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      updateCharacterState({ currentStep: "armor" });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleArmorSelected = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      console.log("Armor selected, transitioning to morality");
      updateCharacterState({ currentStep: "morality" });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleBack = async () => {
    if (isTransitioning || !characterId) return;
    setIsTransitioning(true);
    
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