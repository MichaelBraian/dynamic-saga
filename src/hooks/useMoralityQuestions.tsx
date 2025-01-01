import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
import { useToast } from "@/hooks/use-toast";

export const useMoralityQuestions = (characterId: string) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const calculateMoralityScores = (responses: { question_id: string, answer: string }[]) => {
    if (!questions) return null;

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

    return {
      goodEvilScore: boundedGoodEvil,
      lawfulChaoticScore: boundedLawfulChaotic,
      alignmentScore,
    };
  };

  const saveResponse = async (answer: string) => {
    if (isSubmitting || !questions?.[currentQuestionIndex]) return false;
    
    setIsSubmitting(true);
    console.log('Saving response:', { characterId, questionId: questions[currentQuestionIndex].id, answer });

    try {
      // First, verify character ownership
      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, status')
        .eq('id', characterId)
        .single();

      if (verifyError || !character) {
        throw new Error("Character not found or unauthorized");
      }

      // Save the response using insert instead of upsert
      const { error: responseError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: questions[currentQuestionIndex].id,
          answer
        });

      if (responseError) {
        // If insert fails due to duplicate, try update
        if (responseError.code === '23505') {
          const { error: updateError } = await supabase
            .from('character_responses')
            .update({ answer })
            .match({ 
              character_id: characterId, 
              question_id: questions[currentQuestionIndex].id 
            });
          if (updateError) throw updateError;
        } else {
          throw responseError;
        }
      }

      const nextIndex = currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= questions.length;

      if (isLastQuestion) {
        // Fetch all responses for this character
        const { data: responses, error: responsesError } = await supabase
          .from('character_responses')
          .select('*')
          .eq('character_id', characterId);

        if (responsesError) throw responsesError;
        
        const scores = calculateMoralityScores(responses);
        if (!scores) {
          throw new Error('Failed to calculate morality scores');
        }

        // Save the final scores
        const { error: moralityError } = await supabase
          .from('character_morality')
          .upsert({
            character_id: characterId,
            good_evil_scale: scores.goodEvilScore,
            lawful_chaotic_scale: scores.lawfulChaoticScore,
            alignment_score: scores.alignmentScore
          }, {
            onConflict: 'character_id'
          });

        if (moralityError) throw moralityError;

        // Update character status to attributes
        const { error: statusError } = await supabase
          .from('characters')
          .update({ status: 'attributes' })
          .eq('id', characterId);

        if (statusError) throw statusError;

        return true;
      }

      setCurrentQuestionIndex(nextIndex);
      return false;
    } catch (error) {
      console.error('Error in saveResponse:', error);
      toast({
        variant: "destructive",
        description: "Failed to save your response. Please try again.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentQuestion: questions?.[currentQuestionIndex],
    questionNumber: currentQuestionIndex + 1,
    totalQuestions: questions?.length || 0,
    isLoading,
    isSubmitting,
    saveResponse,
  };
};