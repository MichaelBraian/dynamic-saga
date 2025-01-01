import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMoralityQuestionsState = (
  characterId: string,
  onBack: () => void,
  onContinue: () => void
) => {
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelected = async (answer: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Verify character exists and belongs to current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, status')
        .eq('id', characterId)
        .single();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      const complete = await saveResponse(answer);
      if (complete) {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      toast({
        variant: "destructive",
        description: "Failed to save your response. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isComplete,
    isSubmitting,
    handleAnswerSelected
  };
};