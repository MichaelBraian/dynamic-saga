import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
import { CharacterStatus } from "@/types/character";

export const useMoralityQuestions = (characterId: string) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['morality-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', 'morality');

      if (error) throw error;
      return data as MoralityQuestion[];
    },
  });

  const saveResponse = async (answer: string) => {
    if (!questions?.[currentQuestionIndex]) return false;

    const { error: responseError } = await supabase
      .from('character_responses')
      .insert({
        character_id: characterId,
        question_id: questions[currentQuestionIndex].id,
        answer: answer
      });

    if (responseError) throw responseError;

    // If this was the last question, update character status
    if (currentQuestionIndex === (questions?.length || 0) - 1) {
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'questioning' as CharacterStatus })
        .eq('id', characterId);

      if (statusError) throw statusError;
      return true; // Indicates completion
    }

    setCurrentQuestionIndex(prev => prev + 1);
    return false; // Indicates more questions remain
  };

  return {
    currentQuestion: questions?.[currentQuestionIndex],
    questionNumber: currentQuestionIndex + 1,
    totalQuestions: questions?.length || 0,
    isLoading,
    saveResponse,
  };
};