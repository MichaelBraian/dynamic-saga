import { useState } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterStatus } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";

const CreateCharacter = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<CharacterStatus>("naming");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

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

  const handleClassSelected = async (characterClass: string) => {
    setSelectedClass(characterClass);
    setCurrentStep("clothing");
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
      default:
        break;
    }
  };

  const getBackgroundImage = () => {
    switch (currentStep) {
      case "naming":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp";
      case "gender":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Choose_Gender.webp";
      case "race":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Race.webp";
      case "animal_type":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/animal.webp";
      case "class":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp";
      case "clothing":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp";
      default:
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp";
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{
        backgroundImage: `url('${getBackgroundImage()}')`
      }}
    >
      <HamburgerMenu />
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <CharacterCreationSteps
          currentStep={currentStep}
          characterId={characterId}
          selectedRace={selectedRace}
          selectedAnimalType={selectedAnimalType}
          selectedClass={selectedClass}
          onNameSelected={handleNameSelected}
          onGenderSelected={handleGenderSelected}
          onRaceSelected={handleRaceSelected}
          onAnimalTypeSelected={handleAnimalTypeSelected}
          onClassSelected={handleClassSelected}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default CreateCharacter;