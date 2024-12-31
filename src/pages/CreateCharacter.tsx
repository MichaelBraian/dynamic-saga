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

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp')`
      }}
    >
      <HamburgerMenu />
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        {currentStep === "naming" && (
          <NameSelection onNameSelected={handleNameSelected} />
        )}
        {currentStep === "gender" && characterId && (
          <GenderSelection characterId={characterId} onGenderSelected={handleGenderSelected} />
        )}
        {currentStep === "race" && characterId && (
          <RaceSelection characterId={characterId} onRaceSelected={handleRaceSelected} />
        )}
        {currentStep === "class" && characterId && (
          <ClassSelection characterId={characterId} />
        )}
      </div>
    </div>
  );
};

export default CreateCharacter;