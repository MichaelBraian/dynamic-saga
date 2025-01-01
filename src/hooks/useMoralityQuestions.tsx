import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
import { useToast } from "@/hooks/use-toast";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";

export const useMoralityQuestions = (characterId: string) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();
  const { updateStatus } = useCharacterStatusUpdate();

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

  const saveResponse = async (answer: string) => {
    try {
      if (!questions?.[currentQuestionIndex]) {
        console.error('No question found at current index');
        return false;
      }

      const questionId = questions[currentQuestionIndex].id;
      console.log('Saving response:', { characterId, questionId, answer });

      // First, save the response
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

      // Check if this was the last question
      const nextIndex = currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= (questions?.length || 0);

      if (isLastQuestion) {
        // Calculate and save final morality scores
        await calculateAndSaveMoralityScores(characterId);
        return true;
      }

      setCurrentQuestionIndex(nextIndex);
      return false;
    } catch (error) {
      console.error('Error in saveResponse:', error);
      toast({
        variant: "destructive",
        description: "Failed to save response. Please try again.",
      });
      return false;
    }
  };

  const calculateAndSaveMoralityScores = async (characterId: string) => {
    try {
      // Fetch all responses in a single query
      const { data: responses, error: responsesError } = await supabase
        .from('character_responses')
        .select('question_id, answer')
        .eq('character_id', characterId);

      if (responsesError) throw responsesError;

      if (!questions || !responses) {
        throw new Error('Missing questions or responses data');
      }

      let goodEvilScore = 0;
      let lawfulChaoticScore = 0;
      
      questions.forEach((question, index) => {
        const response = responses.find(r => r.question_id === question.id);
        if (!response) return;

        const choiceNumber = parseInt(response.answer.split('.')[0]);
        if (isNaN(choiceNumber)) return;

        const normalizedScore = choiceNumber <= 2 ? 1 : -1;
        const weightedScore = question.morality_weight * normalizedScore;
        
        if (index % 2 === 0) {
          goodEvilScore += weightedScore;
        } else {
          lawfulChaoticScore += weightedScore;
        }
      });

      const maxPossibleScore = Math.floor(questions.length / 2) * Math.max(...questions.map(q => Math.abs(q.morality_weight)));
      const normalizedGoodEvil = Math.round((goodEvilScore / maxPossibleScore) * 100);
      const normalizedLawfulChaotic = Math.round((lawfulChaoticScore / maxPossibleScore) * 100);
      const boundedGoodEvil = Math.max(-100, Math.min(100, normalizedGoodEvil));
      const boundedLawfulChaotic = Math.max(-100, Math.min(100, normalizedLawfulChaotic));
      const alignmentScore = Math.round((Math.abs(boundedGoodEvil) + Math.abs(boundedLawfulChaotic)) / 2);

      // Save morality scores in a single operation
      const { error: moralityError } = await supabase
        .from('character_morality')
        .upsert({
          character_id: characterId,
          good_evil_scale: boundedGoodEvil,
          lawful_chaotic_scale: boundedLawfulChaotic,
          alignment_score: alignmentScore
        }, {
          onConflict: 'character_id'
        });

      if (moralityError) throw moralityError;

      // Update character status
      await updateStatus(characterId, 'attributes');

    } catch (error) {
      console.error('Error calculating morality scores:', error);
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