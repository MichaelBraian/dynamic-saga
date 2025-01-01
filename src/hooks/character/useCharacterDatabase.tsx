import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { useToast } from "@/hooks/use-toast";

export const useCharacterDatabase = () => {
  const { toast } = useToast();

  const verifyCharacterOwnership = async (characterId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error } = await supabase
        .from('characters')
        .select('user_id, status')
        .eq('id', characterId)
        .maybeSingle();

      if (error) throw error;
      if (!character) throw new Error("Character not found");
      if (character.user_id !== user.id) throw new Error("Unauthorized");

      return character;
    } catch (error) {
      console.error('Error verifying character ownership:', error);
      throw error;
    }
  };

  const updateCharacterStatus = async (characterId: string, status: CharacterStatus) => {
    try {
      const { error } = await supabase
        .from('characters')
        .update({ status })
        .eq('id', characterId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating character status:', error);
      throw error;
    }
  };

  return {
    verifyCharacterOwnership,
    updateCharacterStatus,
    toast
  };
};