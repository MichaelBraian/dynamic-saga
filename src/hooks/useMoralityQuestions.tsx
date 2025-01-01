import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
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
    
    const normalizedGoodEvil = Math.max(-100, Math.min(100, Math.round((goodEvilScore / maxPossibleScore) * 100)));
    const normalizedLawfulChaotic = Math.max(-100, Math.min(100, Math.round((lawfulChaoticScore / maxPossibleScore) * 100)));
    const alignmentScore = Math.round((Math.abs(normalizedGoodEvil) + Math.abs(normalizedLawfulChaotic)) / 2);

    return {
      goodEvilScore: normalizedGoodEvil,
      lawfulChaoticScore: normalizedLawfulChaotic,
      alignmentScore,
    };
  };

  const saveResponse = async (answer: string) => {
    try {
      if (!questions?.[currentQuestionIndex]) {
        console.error('No question found at current index');
        return false;
      }

      const questionId = questions[currentQuestionIndex].id;
      console.log('Saving response:', {
        characterId,
        questionId,
        answer
      });

      // Try to insert first
      const { error: insertError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: questionId,
          answer
        });

      // If insert fails (likely due to duplicate), try update
      if (insertError) {
        const { error: updateError } = await supabase
          .from('character_responses')
          .update({ answer })
          .eq('character_id', characterId)
          .eq('question_id', questionId);

        if (updateError) throw updateError;
      }

      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= questions.length;

      if (isLastQuestion) {
        console.log('Last question answered, calculating scores...');
        
        const { data: responses, error: responsesError } = await supabase
          .from('character_responses')
          .select('*')
          .eq('character_id', characterId);

        if (responsesError) throw responsesError;
        
        console.log('Retrieved responses:', responses);

        const scores = calculateMoralityScores(responses);
        if (!scores) {
          throw new Error('Failed to calculate morality scores');
        }

        console.log('Calculated morality scores:', scores);

        const { error: moralityError } = await supabase
          .from('character_morality')
          .upsert({
            character_id: characterId,
            good_evil_scale: scores.goodEvilScore,
            lawful_chaotic_scale: scores.lawfulChaoticScore,
            alignment_score: scores.alignmentScore
          });

        if (moralityError) throw moralityError;

        console.log('Morality scores saved successfully');
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

  return {
    currentQuestion: questions?.[currentQuestionIndex],
    questionNumber: currentQuestionIndex + 1,
    totalQuestions: questions?.length || 0,
    isLoading,
    saveResponse,
  };
};