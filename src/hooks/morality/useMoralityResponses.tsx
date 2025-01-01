import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";

export const useMoralityResponses = (characterId: string) => {
  const { toast } = useToast();
  const { updateStatus } = useCharacterStatusUpdate();

  const saveResponse = async (questionId: string, answer: string) => {
    try {
      console.log('Saving response:', { characterId, questionId, answer });

      const { error: responseError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: questionId,
          answer
        });

      if (responseError) {
        console.error('Error saving response:', responseError);
        throw responseError;
      }

      return true;
    } catch (error) {
      console.error('Error in saveResponse:', error);
      toast({
        variant: "destructive",
        description: "Failed to save response. Please try again.",
      });
      return false;
    }
  };

  return { saveResponse };
};