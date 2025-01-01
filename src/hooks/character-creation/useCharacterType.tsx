import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCharacterType = () => {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const fetchCharacterType = async (characterId: string) => {
    const { data } = await supabase
      .from('characters')
      .select('race, animal_type, class')
      .eq('id', characterId)
      .single();
    
    if (data) {
      setSelectedRace(data.race);
      setSelectedAnimalType(data.animal_type);
      setSelectedClass(data.class);
    }
  };

  return {
    selectedRace,
    selectedAnimalType,
    selectedClass,
    setSelectedRace,
    setSelectedAnimalType,
    setSelectedClass,
    fetchCharacterType
  };
};