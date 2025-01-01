import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
import { useToast } from "@/hooks/use-toast";
import { useMoralityResponses } from "./morality/useMoralityResponses";
import { useMoralityCalculation } from "./morality/useMoralityCalculation";

export const useMoralityQuestions = (characterId: string) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();
  const { saveResponse } = useMoralityResponses(characterId);
  const { calculateAndSaveMoralityScores } = useMoralityCalculation(characterId);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['morality-questions'],
    queryFn: async () => {
      console.log('Fetching morality questions');
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id');

      if (error) throw error;
      return data as MoralityQuestion[];
    },
  });

  const handleResponse = async (answer: string) => {
    try {
      if (!questions?.[currentQuestionIndex]) {
        console.error('No question found at current index');
        return false;
      }

      const questionId = questions[currentQuestionIndex].id;
      const saved = await saveResponse(questionId, answer);

      if (!saved) return false;

      const nextIndex = currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= (questions?.length || 0);

      if (isLastQuestion) {
        await calculateAndSaveMoralityScores(questions);
        return true;
      }

      setCurrentQuestionIndex(nextIndex);
      return false;
    } catch (error) {
      console.error('Error in handleResponse:', error);
      toast({
        variant: "destructive",
        description: "Failed to save response. Please try again.",
      });
      return false;
    }
  };

  return {
    currentQuestion: questions?.[currentQuestionIndex],
    questionNumber: currentQuestionIndex + 1,
    totalQuestions: questions?.length || 0,
    isLoading,
    saveResponse: handleResponse,
  };
};