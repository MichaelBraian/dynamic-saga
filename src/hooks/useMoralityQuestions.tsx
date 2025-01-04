import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Question = Database['public']['Tables']['questions']['Row'];
type CharacterResponse = Database['public']['Tables']['character_responses']['Row'];

export const useMoralityQuestions = (characterId: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [previousResponses, setPreviousResponses] = useState<CharacterResponse[]>([]);
  const [allResponses, setAllResponses] = useState<CharacterResponse[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('category', 'morality')
          .order('created_at', { ascending: true });

        if (questionsError) throw questionsError;
        if (!questionsData) throw new Error('No questions found');

        setQuestions(questionsData);

        // Fetch previous responses
        const { data: responsesData, error: responsesError } = await supabase
          .from('character_responses')
          .select('*')
          .eq('character_id', characterId);

        if (responsesError) throw responsesError;
        
        if (responsesData) {
          setPreviousResponses(responsesData);
          setAllResponses(responsesData);
        }

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [characterId]);

  const handleResponse = async (answer: string): Promise<boolean> => {
    try {
      if (!questions[currentQuestionIndex]) {
        throw new Error('No current question available');
      }

      const currentQuestionId = questions[currentQuestionIndex].id;

      // First, delete any existing response for this question
      await supabase
        .from('character_responses')
        .delete()
        .eq('character_id', characterId)
        .eq('question_id', currentQuestionId);

      // Then insert the new response
      const { data: newResponse, error: responseError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: currentQuestionId,
          answer: answer,
        })
        .select()
        .single();

      if (responseError) throw responseError;
      if (!newResponse) throw new Error('Failed to create response');

      // Update the responses in state, replacing any existing response for this question
      const updatedResponses = allResponses.filter(r => r.question_id !== currentQuestionId);
      const newResponses = [...updatedResponses, newResponse];
      setPreviousResponses(newResponses);
      setAllResponses(newResponses);

      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error saving response:', err);
      throw err;
    }
  };

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  return {
    currentQuestion: questions[currentQuestionIndex],
    questionNumber: currentQuestionIndex + 1,
    totalQuestions: questions.length,
    isLoading,
    error,
    handleResponse,
    goToQuestion,
    previousResponses,
    allResponses,
  };
};