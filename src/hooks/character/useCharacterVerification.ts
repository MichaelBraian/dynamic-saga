import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCharacterVerification = () => {
  const { toast } = useToast();

  const verifyCharacter = async (characterId: string) => {
    try {
      console.log('Verifying character:', characterId);
      
      const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .maybeSingle();

      if (error) {
        console.error('Error verifying character:', error);
        toast({
          variant: "destructive",
          description: "Failed to verify character. Please try again.",
        });
        throw new Error('Failed to verify character');
      }

      if (!character) {
        console.error('Character not found:', characterId);
        toast({
          variant: "destructive",
          description: "Character not found. Please try again.",
        });
        throw new Error('Character not found');
      }

      return character;
    } catch (error) {
      console.error('Error in character verification:', error);
      throw error;
    }
  };

  return { verifyCharacter };
};