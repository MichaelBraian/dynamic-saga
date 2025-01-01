import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CharacterStatus } from "@/types/character";

export const useCharacterLogic = () => {
  const { toast } = useToast();

  const validateRaceClassCombination = useCallback(async (
    characterId: string,
    race: string,
    characterClass: string
  ): Promise<boolean> => {
    // Validate race-class combinations
    const invalidCombinations = [
      { race: 'Animal', class: 'Paladin' }, // Animals can't be Paladins
      { race: 'Animal', class: 'Artificer' }, // Animals can't be Artificers
    ];

    const isInvalid = invalidCombinations.some(
      combo => combo.race === race && combo.class === characterClass
    );

    if (isInvalid) {
      toast({
        variant: "destructive",
        description: `${race}s cannot be ${characterClass}s. Please choose a different class.`,
      });
      return false;
    }

    return true;
  }, [toast]);

  const getFallbackClass = useCallback((race: string): string => {
    const fallbacks: Record<string, string> = {
      'Animal': 'Druid',
      'Human': 'Fighter',
      'Dwarf': 'Fighter'
    };
    return fallbacks[race] || 'Fighter';
  }, []);

  const handleClassSelection = useCallback(async (
    characterId: string,
    race: string,
    selectedClass: string
  ): Promise<boolean> => {
    try {
      const isValid = await validateRaceClassCombination(characterId, race, selectedClass);
      if (!isValid) {
        const fallbackClass = getFallbackClass(race);
        
        const { error } = await supabase
          .from('characters')
          .update({
            class: fallbackClass,
            status: 'clothing' as CharacterStatus
          })
          .eq('id', characterId);

        if (error) throw error;

        toast({
          description: `Assigned fallback class: ${fallbackClass}`,
        });
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error in class selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to process class selection. Please try again.",
      });
      return false;
    }
  }, [toast, validateRaceClassCombination, getFallbackClass]);

  return {
    validateRaceClassCombination,
    getFallbackClass,
    handleClassSelection,
  };
};