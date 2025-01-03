import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { useToast } from "@/hooks/use-toast";

export const updateCharacterStatus = async (characterId: string, status: CharacterStatus): Promise<boolean> => {
  console.log(`Attempting to update character status to ${status}`);
  
  try {
    // First, fetch the current character data
    const { data: character, error: fetchError } = await supabase
      .from('characters')
      .select('clothing_type, class')
      .eq('id', characterId)
      .single();

    if (fetchError) {
      console.error('Error fetching character:', fetchError);
      throw fetchError;
    }

    // Update the character status
    const { error } = await supabase
      .from('characters')
      .update({ status })
      .eq('id', characterId);

    if (error) {
      console.error('Error updating character status:', error);
      throw error;
    }

    console.log(`Successfully updated character status to ${status}`);
    return true;
  } catch (error) {
    console.error('Error in updateCharacterStatus:', error);
    throw error;
  }
};

export const useCharacterStatusUpdate = () => {
  const { toast } = useToast();

  const updateStatus = async (characterId: string, status: CharacterStatus): Promise<boolean> => {
    try {
      await updateCharacterStatus(characterId, status);
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Failed to update character status to ${status}. Please try again.`,
      });
      return false;
    }
  };

  return { updateStatus };
};