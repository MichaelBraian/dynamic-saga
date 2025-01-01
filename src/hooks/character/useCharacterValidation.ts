import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCharacterValidation = () => {
  const { toast } = useToast();

  const validateNameSelection = async (name: string, userId: string): Promise<boolean> => {
    if (!name.trim() || name.length < 2 || name.length > 50) {
      toast({
        variant: "destructive",
        description: "Name must be between 2 and 50 characters",
      });
      return false;
    }

    const { data: existingCharacter, error: checkError } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name.trim())
      .maybeSingle();

    if (checkError) {
      toast({
        variant: "destructive",
        description: "Error checking character name. Please try again.",
      });
      return false;
    }

    if (existingCharacter) {
      toast({
        variant: "destructive",
        description: "This name is already taken. Please choose another.",
      });
      return false;
    }

    return true;
  };

  const validateStatusUpdate = async (characterId: string, newStatus: string): Promise<boolean> => {
    const { data: character, error } = await supabase
      .from('characters')
      .select('user_id, status')
      .eq('id', characterId)
      .maybeSingle();

    if (error || !character) {
      toast({
        variant: "destructive",
        description: "Error validating character status. Please try again.",
      });
      return false;
    }

    return true;
  };

  return {
    validateNameSelection,
    validateStatusUpdate,
  };
};