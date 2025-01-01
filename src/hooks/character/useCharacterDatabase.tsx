import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { useToast } from "@/hooks/use-toast";

interface Character {
  id: string;
  user_id: string;
  status: CharacterStatus;
  race?: string;
  animal_type?: string;
  class?: string;
}

export const useCharacterDatabase = () => {
  const { toast } = useToast();

  const verifyCharacterOwnership = async (characterId: string): Promise<Character> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error } = await supabase
        .from('characters')
        .select('id, user_id, status, race, animal_type, class')
        .eq('id', characterId)
        .maybeSingle();

      if (error) throw error;
      if (!character) throw new Error("Character not found");
      if (character.user_id !== user.id) throw new Error("Unauthorized");

      return character;
    } catch (error) {
      console.error('Error verifying character ownership:', error);
      toast({
        variant: "destructive",
        description: "Failed to verify character ownership. Please try again.",
      });
      throw error;
    }
  };

  const updateCharacterStatus = async (characterId: string, status: CharacterStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('characters')
        .update({ status })
        .eq('id', characterId);

      if (error) throw error;
      
      toast({
        description: `Successfully updated character status to ${status}`,
        className: "bg-green-500 text-white",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating character status:', error);
      toast({
        variant: "destructive",
        description: "Failed to update character status. Please try again.",
      });
      throw error;
    }
  };

  return {
    verifyCharacterOwnership,
    updateCharacterStatus,
    toast
  };
};