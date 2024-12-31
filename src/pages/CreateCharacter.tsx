import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { useToast } from "@/hooks/use-toast";

const CreateCharacter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { characterId } = useParams();
  const [status, setStatus] = useState<CharacterStatus>();
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCharacterData = async () => {
    if (!characterId) return;

    try {
      const { data: character, error } = await supabase
        .from('characters')
        .select('status, race, animal_type, class')
        .eq('id', characterId)
        .single();

      if (error) throw error;
      
      setStatus(character?.status);
      setSelectedRace(character?.race);
      setSelectedAnimalType(character?.animal_type);
      setSelectedClass(character?.class);
    } catch (error) {
      console.error('Error fetching character data:', error);
      toast({
        variant: "destructive",
        description: "Failed to load character data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterData();
  }, [characterId, toast]);

  const handleNameSelected = (newCharacterId: string) => {
    console.log('Name selected, navigating to:', newCharacterId);
    navigate(`/create-character/${newCharacterId}`);
  };

  const handleGenderSelected = () => {
    console.log('Gender selected');
    fetchCharacterData();
  };

  const handleRaceSelected = async () => {
    console.log('Race selected');
    await fetchCharacterData();
  };

  const handleAnimalTypeSelected = (animalType: string) => {
    console.log('Animal type selected:', animalType);
    setSelectedAnimalType(animalType);
    fetchCharacterData();
  };

  const handleClassSelected = (characterClass: string) => {
    console.log('Class selected:', characterClass);
    setSelectedClass(characterClass);
    fetchCharacterData();
  };

  const handleClothingSelected = () => {
    console.log('Clothing selected');
    fetchCharacterData();
  };

  const handleBack = () => {
    console.log('Going back');
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-lg">Loading character data...</p>
      </div>
    );
  }

  if (!characterId || !status) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-lg">Character not found</p>
      </div>
    );
  }

  return (
    <CharacterCreationSteps 
      currentStep={status}
      characterId={characterId}
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
  );
};

export default CreateCharacter;