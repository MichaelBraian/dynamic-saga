import { useEffect } from "react";
import { CharacterStatus } from "@/types/character";
import { useCharacterState } from "./character/useCharacterState";
import { useCharacterDatabase } from "./character/useCharacterDatabase";
import { useCharacterNavigation } from "./character/useCharacterNavigation";
import { useCharacterOperations } from "./character/useCharacterOperations";
import { supabase } from "@/integrations/supabase/client";

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
  const { handleClassSelection } = useCharacterOperations();

  useEffect(() => {
    if (!characterId) return;

    const setupCharacterSubscription = async () => {
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
            if (payload.new && payload.new.status) {
              updateCharacterState({ currentStep: payload.new.status as CharacterStatus });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const initializeCharacter = async () => {
      try {
        const character = await verifyCharacterOwnership(characterId);
        if (character) {
          updateCharacterState({
            characterId,
            currentStep: character.status,
            selectedRace: character.race || null,
            selectedAnimalType: character.animal_type || null,
            selectedClass: character.class || null
          });
        }
      } catch (error) {
        console.error('Error initializing character:', error);
      }
    };

    setupCharacterSubscription();
    initializeCharacter();
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
    
    try {
      await handleNavigation(characterId, "race", () => {
        updateCharacterState({ currentStep: "race" });
      });
    } catch (error) {
      console.error('Error handling gender selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed to next step. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
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

  const handleClassSelected = async (characterClass: string) => {
    if (isTransitioning || !characterId || !selectedRace) return;
    setIsTransitioning(true);
    
    try {
      const success = await handleClassSelection(characterId, selectedRace, characterClass);
      if (success) {
        updateCharacterState({
          currentStep: "clothing",
          selectedClass: characterClass
        });
      }
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
