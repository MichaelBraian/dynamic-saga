import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useQueryClient } from '@tanstack/react-query';

type Question = Database['public']['Tables']['questions']['Row'];
type CharacterResponse = Database['public']['Tables']['character_responses']['Row'];

export const useMoralityQuestions = (characterId: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [previousResponses, setPreviousResponses] = useState<CharacterResponse[]>([]);
  const [allResponses, setAllResponses] = useState<CharacterResponse[]>([]);
  const queryClient = useQueryClient();

  const fetchLatestResponses = async () => {
    try {
      const { data: responses, error: responsesError } = await supabase
        .from('character_responses')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (responsesError) throw responsesError;
      
      if (responses) {
        // Get unique responses (latest response for each question)
        const uniqueResponses = Object.values(
          responses.reduce((acc: Record<string, CharacterResponse>, curr: CharacterResponse) => {
            if (!acc[curr.question_id] || new Date(curr.created_at) > new Date(acc[curr.question_id].created_at)) {
              acc[curr.question_id] = curr;
            }
            return acc;
          }, {})
        ) as CharacterResponse[];

        setPreviousResponses(uniqueResponses);
        setAllResponses(uniqueResponses);
      }
    } catch (err) {
      console.error('Error fetching responses:', err);
      throw err;
    }
  };

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

        // Fetch latest responses
        await fetchLatestResponses();

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch questions'));
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [characterId]);

  const handleResponse = async (answer: string, questionId: string): Promise<boolean> => {
    try {
      // First, delete any existing response for this question
      await supabase
        .from('character_responses')
        .delete()
        .eq('character_id', characterId)
        .eq('question_id', questionId);

      // Then insert the new response
      const { data: newResponse, error: responseError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: questionId,
          answer: answer,
        })
        .select()
        .single();

      if (responseError) throw responseError;
      if (!newResponse) throw new Error('Failed to create response');

      // Fetch latest responses to ensure we have the most up-to-date data
      await fetchLatestResponses();

      // Invalidate the morality score query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['morality-score', characterId] });

      return true;
    } catch (err) {
      console.error('Error saving response:', err);
      throw err;
    }
  };

  return {
    questions,
    totalQuestions: questions.length,
    isLoading,
    error,
    handleResponse,
    previousResponses,
    allResponses,
  };
};