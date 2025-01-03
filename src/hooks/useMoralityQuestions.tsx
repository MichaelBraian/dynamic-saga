import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
import { useToast } from "@/hooks/use-toast";
import { useMoralityResponses } from "./morality/useMoralityResponses";
import { useMoralityCalculation } from "./morality/useMoralityCalculation";
import { Database } from "@/integrations/supabase/types";

type CharacterResponse = Database['public']['Tables']['character_responses']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];

export const useMoralityQuestions = (characterId: string) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [previousResponses, setPreviousResponses] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { saveResponse } = useMoralityResponses(characterId);
  const { calculateAndSaveMoralityScores } = useMoralityCalculation(characterId);

  const { data: questions, isLoading: isQuestionsLoading } = useQuery<Question[]>({
    queryKey: ['morality-questions'],
    queryFn: async () => {
      console.log('Fetching morality questions');
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', 'morality')
        .order('id');

      if (error) throw error;
      return data;
    },
  });

  const { data: responses, isLoading: isResponsesLoading } = useQuery<CharacterResponse[]>({
    queryKey: ['morality-responses', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_responses')
        .select('*')
        .eq('character_id', characterId);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (responses) {
      const responseMap = responses.reduce((acc, response) => {
        acc[response.question_id] = response.answer;
        return acc;
      }, {} as Record<string, string>);
      setPreviousResponses(responseMap);
    }
  }, [responses]);

  const handleResponse = async (answer: string) => {
    try {
      if (!questions?.[currentQuestionIndex]) {
        console.error('No question found at current index');
        return false;
      }

      const questionId = questions[currentQuestionIndex].id;
      const saved = await saveResponse(questionId, answer);

      if (!saved) return false;

      setPreviousResponses(prev => ({
        ...prev,
        [questionId]: answer
      }));

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

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < (questions?.length || 0)) {
      setCurrentQuestionIndex(index);
    }
  };

  const isLoading = isQuestionsLoading || isResponsesLoading;

  return {
    currentQuestion: questions?.[currentQuestionIndex],
    questionNumber: currentQuestionIndex + 1,
    totalQuestions: questions?.length || 0,
    isLoading,
    saveResponse: handleResponse,
    goToQuestion,
    previousResponse: questions?.[currentQuestionIndex] 
      ? previousResponses[questions[currentQuestionIndex].id]
      : undefined
  };
};