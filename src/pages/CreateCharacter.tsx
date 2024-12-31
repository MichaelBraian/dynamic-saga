import { useState } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { GenderSelection } from "@/components/GenderSelection";
import { RaceSelection } from "@/components/RaceSelection";
import { ClassSelection } from "@/components/ClassSelection";
import { NameSelection } from "@/components/NameSelection";
import { CharacterStatus } from "@/types/character";

const CreateCharacter = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<CharacterStatus>("naming");

  const handleNameSelected = (newCharacterId: string) => {
    setCharacterId(newCharacterId);
    setCurrentStep("gender");
  };

  const handleGenderSelected = () => {
    setCurrentStep("race");
  };

  const handleRaceSelected = () => {
    setCurrentStep("class");
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
      case "class":
        setCurrentStep("race");
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
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp";
      case "race":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Race_Character.webp";
      case "class":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class_Character.webp";
      default:
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp";
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${getBackgroundImage()}')`
      }}
    >
      <HamburgerMenu />
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        {currentStep === "naming" && (
          <NameSelection onNameSelected={handleNameSelected} />
        )}
        {currentStep === "gender" && characterId && (
          <GenderSelection 
            characterId={characterId} 
            onGenderSelected={handleGenderSelected}
            onBack={handleBack}
          />
        )}
        {currentStep === "race" && characterId && (
          <RaceSelection 
            characterId={characterId} 
            onRaceSelected={handleRaceSelected}
            onBack={handleBack}
          />
        )}
        {currentStep === "class" && characterId && (
          <ClassSelection 
            characterId={characterId}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCharacter;