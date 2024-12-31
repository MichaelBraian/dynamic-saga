import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterBackground } from "@/components/character-creation/CharacterBackground";
import { useToast } from "@/hooks/use-toast";

const CreateCharacter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { characterId } = useParams();
  const [status, setStatus] = useState<CharacterStatus>("naming");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCharacterData = async (id: string) => {
    try {
      const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (character) {
        console.log('Character data:', character);
        setStatus(character.status);
        setSelectedRace(character.race);
        setSelectedAnimalType(character.animal_type);
        setSelectedClass(character.class);
      }
    } catch (error) {
      console.error('Error fetching character:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load character data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (characterId) {
      console.log('Fetching character data for:', characterId);
      fetchCharacterData(characterId);
    } else {
      setIsLoading(false);
    }
  }, [characterId]);

  const handleNameSelected = (newCharacterId: string) => {
    console.log('Name selected, navigating to:', newCharacterId);
    navigate(`/create-character/${newCharacterId}`);
  };

  const handleGenderSelected = () => {
    console.log('Gender selected');
    fetchCharacterData(characterId!);
  };

  const handleRaceSelected = async () => {
    console.log('Race selected');
    await fetchCharacterData(characterId!);
  };

  const handleAnimalTypeSelected = (animalType: string) => {
    console.log('Animal type selected:', animalType);
    setSelectedAnimalType(animalType);
    fetchCharacterData(characterId!);
  };

  const handleClassSelected = (characterClass: string) => {
    console.log('Class selected:', characterClass);
    setSelectedClass(characterClass);
    fetchCharacterData(characterId!);
  };

  const handleClothingSelected = () => {
    console.log('Clothing selected');
    fetchCharacterData(characterId!);
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
    <div className="relative min-h-screen">
      <CharacterBackground currentStep={status} />
      <div className="absolute inset-0 flex items-center justify-center">
        <CharacterCreationSteps 
          currentStep={characterId ? status : "naming"}
          characterId={characterId || ""}
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
    </div>
  );
};

export default CreateCharacter;