import { useState } from "react";
import { CharacterStatus } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";
import { useCharacterStatus } from "./character-creation/useCharacterStatus";
import { useCharacterType } from "./character-creation/useCharacterType";
import { useStepNavigation } from "./character-creation/useStepNavigation";

export const useCharacterCreation = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  
  const { currentStep, setCurrentStep } = useCharacterStatus(characterId);
  
  const {
    selectedRace,
    selectedAnimalType,
    selectedClass,
    setSelectedRace,
    setSelectedAnimalType,
    setSelectedClass,
    fetchCharacterType
  } = useCharacterType();

  const { handleBack } = useStepNavigation(
    currentStep,
    setCurrentStep,
    selectedRace,
    setSelectedRace,
    setSelectedAnimalType,
    setSelectedClass
  );

  const handleNameSelected = (newCharacterId: string) => {
    setCharacterId(newCharacterId);
    setCurrentStep("gender");
  };

  const handleGenderSelected = () => {
    setCurrentStep("race");
  };

  const handleRaceSelected = async () => {
    if (characterId) {
      const { data } = await supabase
        .from('characters')
        .select('race, status')
        .eq('id', characterId)
        .single();
      
      setSelectedRace(data?.race || null);
      setCurrentStep(data?.status || 'class');
    }
  };

  const handleAnimalTypeSelected = (animalType: string) => {
    setSelectedAnimalType(animalType);
    setCurrentStep("class");
  };

  const handleClassSelected = (characterClass: string) => {
    setSelectedClass(characterClass);
    setCurrentStep("clothing");
  };

  const handleClothingSelected = () => {
    setCurrentStep("armor");
  };

  const handleArmorSelected = () => {
    console.log("Armor selected, transitioning to morality");
    setCurrentStep("morality");
  };

  const handleMoralityCompleted = async () => {
    console.log("Morality completed, transitioning to attributes");
    if (characterId) {
      const { error } = await supabase
        .from('characters')
        .update({ status: 'attributes' })
        .eq('id', characterId);

      if (error) {
        console.error('Error updating character status:', error);
        return;
      }
      setCurrentStep("attributes");
    }
  };

  return {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected,
    handleMoralityCompleted,
    handleBack,
    setCurrentStep,
  };
};