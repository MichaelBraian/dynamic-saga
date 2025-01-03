import { useState } from "react";
import { CharacterStatus } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";
import { useCharacterStatus } from "./character-creation/useCharacterStatus";
import { useCharacterType } from "./character-creation/useCharacterType";
import { useStepNavigation } from "./character-creation/useStepNavigation";
import { useToast } from "./use-toast";

export const useCharacterCreation = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  const { toast } = useToast();
  
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
        toast({
          variant: "destructive",
          description: "Failed to update character status. Please try again.",
        });
        return;
      }
      setCurrentStep("attributes");
    }
  };

  const handleAttributesCompleted = async () => {
    console.log("Attributes completed, transitioning to specialty");
    if (characterId) {
      const { error } = await supabase
        .from('characters')
        .update({ status: 'specialty' })
        .eq('id', characterId);

      if (error) {
        console.error('Error updating character status:', error);
        toast({
          variant: "destructive",
          description: "Failed to update character status. Please try again.",
        });
        return;
      }
      setCurrentStep("specialty");
    }
  };

  const handleSpecialtySelected = async () => {
    console.log("Specialty selected, transitioning to faith_points");
    if (characterId) {
      const { error } = await supabase
        .from('characters')
        .update({ status: 'faith_points' })
        .eq('id', characterId);

      if (error) {
        console.error('Error updating character status:', error);
        toast({
          variant: "destructive",
          description: "Failed to update character status. Please try again.",
        });
        return;
      }
      setCurrentStep("faith_points");
    }
  };

  const handleFaithPointsCompleted = async () => {
    console.log("Faith points completed, transitioning to questioning");
    if (characterId) {
      const { error } = await supabase
        .from('characters')
        .update({ status: 'questioning' })
        .eq('id', characterId);

      if (error) {
        console.error('Error updating character status:', error);
        toast({
          variant: "destructive",
          description: "Failed to update character status. Please try again.",
        });
        return;
      }
      setCurrentStep("questioning");
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
    handleMoralityCompleted,
    handleAttributesCompleted,
    handleSpecialtySelected,
    handleFaithPointsCompleted,
    handleBack,
    setCurrentStep,
  };
};