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
      console.log('Fetching morality questions');
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', 'morality');

      if (error) throw error;
      return data as MoralityQuestion[];
    },
  });

  const calculateMoralityScores = async (responses: { question_id: string, answer: string }[]) => {
    if (!questions) return null;

    let goodEvilScore = 0;
    let lawfulChaoticScore = 0;
    let totalResponses = 0;
    
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.question_id);
      if (!question) return;

      const choiceNumber = parseInt(response.answer.split('.')[0]);
      if (isNaN(choiceNumber)) return;
      
      totalResponses++;
      
      const normalizedScore = choiceNumber <= 2 ? 1 : -1;
      const weightedScore = question.morality_weight * normalizedScore;
      
      if (totalResponses % 2 === 0) {
        lawfulChaoticScore += weightedScore;
      } else {
        goodEvilScore += weightedScore;
      }
    });

    if (totalResponses === 0) {
      console.error('No valid responses found');
      return null;
    }

    const maxPossibleScore = questions.reduce((acc, q) => acc + Math.abs(q.morality_weight), 0) / 2;

    const normalizedGoodEvil = Math.max(-100, Math.min(100, Math.round((goodEvilScore / maxPossibleScore) * 100)));
    const normalizedLawfulChaotic = Math.max(-100, Math.min(100, Math.round((lawfulChaoticScore / maxPossibleScore) * 100)));
    const alignmentScore = Math.max(0, Math.min(100, Math.round(((normalizedGoodEvil + 100) / 2 + (normalizedLawfulChaotic + 100) / 2) / 2)));

    return {
      goodEvilScore: normalizedGoodEvil,
      lawfulChaoticScore: normalizedLawfulChaotic,
      alignmentScore,
    };
  };

  const saveResponse = async (answer: string) => {
    if (!questions?.[currentQuestionIndex]) {
      console.error('No question found at current index');
      toast({
        variant: "destructive",
        description: "Failed to save response: Question not found",
      });
      return false;
    }

    try {
      const questionId = questions[currentQuestionIndex].id;
      
      console.log('Saving response:', {
        characterId,
        questionId,
        answer
      });

      // Save the current response
      const { error: responseError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: questionId,
          answer: answer
        });

      if (responseError) throw responseError;

      // If this was the last question
      if (currentQuestionIndex === questions.length - 1) {
        // Fetch all responses in a single query
        const { data: responses, error: responsesError } = await supabase
          .from('character_responses')
          .select('question_id, answer')
          .eq('character_id', characterId);

        if (responsesError) throw responsesError;
        if (!responses) {
          throw new Error('No responses found');
        }

        console.log('Retrieved responses:', responses);

        // Calculate scores
        const scores = await calculateMoralityScores(responses);
        if (!scores) {
          throw new Error('Failed to calculate morality scores');
        }

        console.log('Saving morality scores:', scores);

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

        return true; // Indicates completion
      }

      setCurrentQuestionIndex(prev => prev + 1);
      return false; // Indicates more questions remain
    } catch (error) {
      console.error('Error in saveResponse:', error);
      toast({
        variant: "destructive",
        description: "Failed to save response. Please try again.",
      });
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