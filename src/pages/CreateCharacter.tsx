import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";

const CreateCharacter = () => {
  const { characterId } = useParams();
  const [status, setStatus] = useState<CharacterStatus>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacterStatus = async () => {
      if (!characterId) return;

      try {
        const { data: character, error } = await supabase
          .from('characters')
          .select('status')
          .eq('id', characterId)
          .single();

        if (error) throw error;
        setStatus(character?.status);
      } catch (error) {
        console.error('Error fetching character status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterStatus();
  }, [characterId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!characterId || !status) {
    return <div>Character not found</div>;
  }

  return <CharacterCreationSteps 
    currentStep={status}
    characterId={characterId}
    selectedRace={null}
    selectedAnimalType={null}
    selectedClass={null}
    onNameSelected={() => {}}
    onGenderSelected={() => {}}
    onRaceSelected={async () => {}}
    onAnimalTypeSelected={() => {}}
    onClassSelected={() => {}}
    onClothingSelected={() => {}}
    onBack={() => {}}
  />;
};

export default CreateCharacter;