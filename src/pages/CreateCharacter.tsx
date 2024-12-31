import { useState } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { GenderSelection } from "@/components/GenderSelection";
import { RaceSelection } from "@/components/RaceSelection";
import { ClassSelection } from "@/components/ClassSelection";
import { AnimalTypeSelection } from "@/components/AnimalTypeSelection";
import { NameSelection } from "@/components/NameSelection";
import { CharacterStatus } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";

const CreateCharacter = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<CharacterStatus>("naming");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);

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
        .select('race')
        .eq('id', characterId)
        .single();
      
      setSelectedRace(data?.race || null);
      setCurrentStep("class");
    }
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
        setSelectedRace(null);
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
      case "class":
        return currentStep === "class" && selectedRace === 'Animal' 
          ? "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/animal.webp"
          : "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp";
      default:
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "naming":
        return (
          <div className="animate-fade-in">
            <NameSelection onNameSelected={handleNameSelected} />
          </div>
        );
      case "gender":
        return (
          <div className="animate-fade-in">
            <GenderSelection 
              characterId={characterId!} 
              onGenderSelected={handleGenderSelected}
              onBack={handleBack}
            />
          </div>
        );
      case "race":
        return (
          <div className="animate-fade-in">
            <RaceSelection 
              characterId={characterId!} 
              onRaceSelected={handleRaceSelected}
              onBack={handleBack}
            />
          </div>
        );
      case "class":
        return (
          <div className="animate-fade-in">
            {selectedRace === 'Animal' ? (
              <AnimalTypeSelection 
                characterId={characterId!}
                onBack={handleBack}
              />
            ) : (
              <ClassSelection 
                characterId={characterId!}
                onBack={handleBack}
              />
            )}
          </div>
        );
      default:
        return null;
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
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default CreateCharacter;