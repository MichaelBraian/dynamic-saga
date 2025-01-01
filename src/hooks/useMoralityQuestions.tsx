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
        .eq('category', 'morality')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as MoralityQuestion[];
    },
  });

  const calculateMoralityScores = async (responses: { question_id: string, answer: string }[]) => {
    if (!questions) return null;

    let goodEvilScore = 0;
    let lawfulChaoticScore = 0;
    
    // Process responses in order of questions
    questions.forEach((question, index) => {
      const response = responses.find(r => r.question_id === question.id);
      if (!response) return;

      const choiceNumber = parseInt(response.answer.split('.')[0]);
      if (isNaN(choiceNumber)) return;
      
      const normalizedScore = choiceNumber <= 2 ? 1 : -1;
      const weightedScore = question.morality_weight * normalizedScore;
      
      // Alternate between good/evil and lawful/chaotic questions
      if (index % 2 === 0) {
        goodEvilScore += weightedScore;
      } else {
        lawfulChaoticScore += weightedScore;
      }
    });

    // Calculate normalized scores
    const maxPossibleScore = Math.floor(questions.length / 2) * Math.max(...questions.map(q => Math.abs(q.morality_weight)));
    
    const normalizedGoodEvil = Math.max(-100, Math.min(100, Math.round((goodEvilScore / maxPossibleScore) * 100)));
    const normalizedLawfulChaotic = Math.max(-100, Math.min(100, Math.round((lawfulChaoticScore / maxPossibleScore) * 100)));
    const alignmentScore = Math.max(0, Math.min(100, Math.round(((normalizedGoodEvil + 100) / 2 + (normalizedLawfulChaotic + 100) / 2) / 2)));

    return {
      goodEvilScore: normalizedGoodEvil,
      lawfulChaoticScore,
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

      // Check if response already exists
      const { data: existingResponse } = await supabase
        .from('character_responses')
        .select('*')
        .eq('character_id', characterId)
        .eq('question_id', questionId)
        .single();

      if (existingResponse) {
        console.log('Response already exists, updating...');
        const { error: updateError } = await supabase
          .from('character_responses')
          .update({ answer })
          .eq('character_id', characterId)
          .eq('question_id', questionId);

        if (updateError) throw updateError;
      } else {
        console.log('Creating new response...');
        const { error: insertError } = await supabase
          .from('character_responses')
          .insert({
            character_id: characterId,
            question_id: questionId,
            answer: answer
          });

        if (insertError) throw insertError;
      }

      // If this was the last question
      if (currentQuestionIndex === questions.length - 1) {
        console.log('Last question answered, calculating scores...');
        
        // Fetch all responses for this character
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

        console.log('Calculated morality scores:', scores);

        // Save morality scores
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