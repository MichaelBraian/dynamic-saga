import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { useToast } from "@/hooks/use-toast";

export const useCharacterOperations = () => {
  const { toast } = useToast();

  const handleClassSelection = async (
    characterId: string,
    selectedRace: string,
    characterClass: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('characters')
        .update({
          class: characterClass,
          status: 'clothing' as CharacterStatus
        })
        .eq('id', characterId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in class selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save class selection. Please try again.",
      });
      return false;
    }
  };

  return {
    handleClassSelection
  };
};