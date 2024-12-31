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
    if (!questions) return null;

    let goodEvilScore = 0;
    let lawfulChaoticScore = 0;
    let totalResponses = 0;
    
    // Calculate scores based on responses
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.question_id);
      if (!question) return;

      // Parse the choice number from the answer (e.g., "1. Some answer" -> 1)
      const choiceNumber = parseInt(response.answer.split('.')[0]);
      if (isNaN(choiceNumber)) return;
      
      totalResponses++;
      
      // Normalize choice impact: 1 & 2 are good/lawful, 3 & 4 are evil/chaotic
      const normalizedScore = choiceNumber <= 2 ? 1 : -1;
      const weightedScore = question.morality_weight * normalizedScore;
      
      // Alternate questions between good/evil and lawful/chaotic
      if (totalResponses % 2 === 0) {
        lawfulChaoticScore += weightedScore;
      } else {
        goodEvilScore += weightedScore;
      }
    });

    // Ensure we have responses
    if (totalResponses === 0) {
      console.error('No valid responses found');
      return null;
    }

    // Calculate the maximum possible score for normalization
    const maxPossibleScore = questions.reduce((acc, q) => acc + Math.abs(q.morality_weight), 0) / 2;

    // Normalize scores to -100 to 100 range
    const normalizedGoodEvil = Math.round((goodEvilScore / maxPossibleScore) * 100);
    const normalizedLawfulChaotic = Math.round((lawfulChaoticScore / maxPossibleScore) * 100);

    // Calculate overall alignment score (0-100)
    // Convert from -100 to 100 scale to 0 to 100 scale
    const alignmentScore = Math.round(((normalizedGoodEvil + 100) / 2 + (normalizedLawfulChaotic + 100) / 2) / 2);

    console.log('Morality Scores:', {
      goodEvilScore: normalizedGoodEvil,
      lawfulChaoticScore: normalizedLawfulChaotic,
      alignmentScore,
      totalResponses,
    });

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
        if (!responses) {
          throw new Error('No responses found');
        }

        // Calculate scores
        const scores = await calculateMoralityScores(responses);
        if (!scores) {
          throw new Error('Failed to calculate morality scores');
        }

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
          .update({ status: 'attributes' as CharacterStatus })
          .eq('id', characterId);

        if (statusError) throw statusError;

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