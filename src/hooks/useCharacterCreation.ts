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

  return {
    characterId,
    setCharacterId,
    currentStep,
    setCurrentStep,
    selectedRace,
    setSelectedRace,
    selectedAnimalType,
    setSelectedAnimalType,
    selectedClass,
    setSelectedClass,
  };
};