import { useState, useEffect } from "react";
import { CharacterStatus } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";

export const useCharacterCreation = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<CharacterStatus>("naming");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  useEffect(() => {
    if (characterId) {
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
              setCurrentStep(payload.new.status);
            }
          }
        )
        .subscribe();

      const fetchCharacter = async () => {
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('id', characterId)
          .single();

        if (!error && data) {
          setCurrentStep(data.status);
          setSelectedRace(data.race);
          setSelectedAnimalType(data.animal_type);
          setSelectedClass(data.class);
        }
      };

      fetchCharacter();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [characterId]);

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

  const handleBack = () => {
    switch (currentStep) {
      case "gender":
        setCurrentStep("naming");
        setCharacterId(null);
        break;
      case "race":
        setCurrentStep("gender");
        break;
      case "animal_type":
        setCurrentStep("race");
        setSelectedAnimalType(null);
        break;
      case "class":
        if (selectedRace === 'Animal') {
          setCurrentStep("animal_type");
        } else {
          setCurrentStep("race");
          setSelectedRace(null);
        }
        break;
      case "clothing":
        setCurrentStep("class");
        setSelectedClass(null);
        break;
      case "armor":
        setCurrentStep("clothing");
        break;
      case "morality":
        setCurrentStep("armor");
        break;
      default:
        break;
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
    handleBack,
  };
};