import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { useToast } from "@/hooks/use-toast";

const CreateCharacter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<CharacterStatus>("naming");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameSelected = (newCharacterId: string) => {
    console.log('Name selected, navigating to:', newCharacterId);
    navigate(`/create-character/${newCharacterId}`);
  };

  const handleGenderSelected = () => {
    console.log('Gender selected');
  };

  const handleRaceSelected = async () => {
    console.log('Race selected');
  };

  const handleAnimalTypeSelected = (animalType: string) => {
    console.log('Animal type selected:', animalType);
    setSelectedAnimalType(animalType);
  };

  const handleClassSelected = (characterClass: string) => {
    console.log('Class selected:', characterClass);
    setSelectedClass(characterClass);
  };

  const handleClothingSelected = () => {
    console.log('Clothing selected');
  };

  const handleBack = () => {
    console.log('Going back');
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <p className="text-white text-lg font-['Cinzel']">Loading character creation...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <CharacterCreationSteps 
        currentStep={status}
        characterId=""
        selectedRace={selectedRace}
        selectedAnimalType={selectedAnimalType}
        selectedClass={selectedClass}
        onNameSelected={handleNameSelected}
        onGenderSelected={handleGenderSelected}
        onRaceSelected={handleRaceSelected}
        onAnimalTypeSelected={handleAnimalTypeSelected}
        onClassSelected={handleClassSelected}
        onClothingSelected={handleClothingSelected}
        onBack={handleBack}
      />
    </div>
  );
};

export default CreateCharacter;