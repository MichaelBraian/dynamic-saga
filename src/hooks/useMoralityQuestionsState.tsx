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

      // Get current question
      const { data: responses, error: responsesError } = await supabase
        .from('character_responses')
        .select('question_id')
        .eq('character_id', characterId);

      if (responsesError) throw responsesError;

      // Get the next question that hasn't been answered yet
      const { data: nextQuestion, error: questionError } = await supabase
        .from('questions')
        .select('id')
        .order('id')
        .limit(1);

      if (questionError || !nextQuestion?.[0]) throw questionError;

      // Save the response
      const { error: saveError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: nextQuestion[0].id,
          answer: answer
        });

      if (saveError) throw saveError;

      // Check if all questions have been answered
      const { data: allQuestions, error: allQuestionsError } = await supabase
        .from('questions')
        .select('count');

      if (allQuestionsError) throw allQuestionsError;

      const totalQuestions = allQuestions?.[0]?.count || 0;
      const answeredQuestions = (responses?.length || 0) + 1;

      if (answeredQuestions >= totalQuestions) {
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