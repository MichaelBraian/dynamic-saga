import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";

export const useCharacterNavigation = (characterId: string) => {
  const navigate = useNavigate();
  const [selectedRace, setSelectedRace] = useState("");

  const handleRaceSelected = async (race: string) => {
    setSelectedRace(race);
    try {
      const { error } = await supabase
        .from('characters')
        .update({ race: race, status: 'class' as CharacterStatus })
        .eq('id', characterId);

      if (error) throw error;
      navigate(`/create-character/${characterId}/class`);
    } catch (error) {
      console.error('Error updating race:', error);
    }
  };

  const handleClassSelected = async (classType: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .update({ class: classType, status: 'background' as CharacterStatus })
        .eq('id', characterId);

      if (error) throw error;
      navigate(`/create-character/${characterId}/background`);
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleBackgroundSelected = async (background: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .update({ background: background, status: 'completed' as CharacterStatus })
        .eq('id', characterId);

      if (error) throw error;
      navigate(`/create-character/${characterId}/completed`);
    } catch (error) {
      console.error('Error updating background:', error);
    }
  };

  return {
    handleRaceSelected,
    handleClassSelected,
    handleBackgroundSelected,
  };
};
