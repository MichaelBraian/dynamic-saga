import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
import { CharacterStatus } from "@/types/character";
import { useToast } from "@/hooks/use-toast";

export const useMoralityQuestions = (characterId: string) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();

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

  const calculateMoralityScores = async (responses: { question_id: string, answer: string }[]) => {
    let goodEvilScore = 0;
    let lawfulChaoticScore = 0;

    for (const response of responses) {
      const question = questions?.find(q => q.id === response.question_id);
      if (!question) continue;

      const choiceNumber = parseInt(response.answer.split('.')[0]);
      
      if (choiceNumber <= 2) {
        goodEvilScore += question.morality_weight;
        lawfulChaoticScore += question.morality_weight;
      } else {
        goodEvilScore -= question.morality_weight;
        lawfulChaoticScore -= question.morality_weight;
      }
    }

    const alignmentScore = Math.min(
      Math.max(
        Math.floor(((goodEvilScore + lawfulChaoticScore) / 2 + 50) * 100),
        0
      ),
      100
    );

    return { goodEvilScore, lawfulChaoticScore, alignmentScore };
  };

  const saveResponse = async (answer: string) => {
    if (!questions?.[currentQuestionIndex]) return false;

    try {
      // Save the current response
      const { error: responseError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: questions[currentQuestionIndex].id,
          answer: answer
        });

      if (responseError) throw responseError;

      // If this was the last question
      if (currentQuestionIndex === questions.length - 1) {
        // Fetch all responses
        const { data: responses, error: responsesError } = await supabase
          .from('character_responses')
          .select('question_id, answer')
          .eq('character_id', characterId);

        if (responsesError) throw responsesError;
        if (!responses || responses.length === 0) {
          throw new Error('No responses found');
        }

        // Calculate scores
        const scores = await calculateMoralityScores(responses);

        // Save morality scores
        const { error: moralityError } = await supabase
          .from('character_morality')
          .insert({
            character_id: characterId,
            good_evil_scale: scores.goodEvilScore,
            lawful_chaotic_scale: scores.lawfulChaoticScore,
            alignment_score: scores.alignmentScore
          });

        if (moralityError) throw moralityError;

        // Update character status
        const { error: statusError } = await supabase
          .from('characters')
          .update({ status: 'questioning' as CharacterStatus })
          .eq('id', characterId);

        if (statusError) throw statusError;

        return true; // Indicates completion
      }

      setCurrentQuestionIndex(prev => prev + 1);
      return false; // Indicates more questions remain
    } catch (error) {
      console.error('Error in saveResponse:', error);
      throw error;
    }
  };

  return {
    currentQuestion: questions?.[currentQuestionIndex],
    questionNumber: currentQuestionIndex + 1,
    totalQuestions: questions?.length || 0,
    isLoading,
    saveResponse,
  };
};