import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMoralityResponses } from "./morality/useMoralityResponses";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Question = Database['public']['Tables']['questions']['Row'];
type Response = Database['public']['Tables']['character_responses']['Row'];

export const useMoralityQuestions = (characterId: string) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [previousResponses, setPreviousResponses] = useState<Response[]>([]);
  const { toast } = useToast();
  const { saveResponse } = useMoralityResponses(characterId);

  const { data: questions, isLoading, error } = useQuery<Question[]>({
    queryKey: ['morality-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', 'morality')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No questions found');
      }

      return data;
    },
  });

  // Fetch previous responses when component mounts or characterId changes
  useEffect(() => {
    const fetchPreviousResponses = async () => {
      const { data, error } = await supabase
        .from('character_responses')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching previous responses:', error);
        return;
      }

      if (data) {
        console.log('Previous responses loaded:', data);
        setPreviousResponses(data);
      }
    };

    fetchPreviousResponses();
  }, [characterId]);

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleResponse = async (answer: string) => {
    if (!currentQuestion) {
      console.error('No current question available');
      toast({
        variant: "destructive",
        description: "No question available. Please try again.",
      });
      return false;
    }

    if (!characterId) {
      toast({
        variant: "destructive",
        description: "No character ID provided.",
      });
      return false;
    }

    const success = await saveResponse(answer, currentQuestion.id);
    
    if (!success) {
      toast({
        variant: "destructive",
        description: "Failed to save your response. Please try again.",
      });
      return false;
    }

    // Update local responses after saving
    const { data: updatedResponses } = await supabase
      .from('character_responses')
      .select('*')
      .eq('character_id', characterId)
      .order('created_at', { ascending: true });

    if (updatedResponses) {
      setPreviousResponses(updatedResponses);
    }

    // Move to next question if not at the end
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return false;
    }

    // If we're at the last question, return true to indicate completion
    return currentQuestionIndex === (questions?.length ?? 0) - 1;
  };

  const goToQuestion = (index: number) => {
    if (questions && index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  return {
    currentQuestion,
    questionNumber: currentQuestionIndex + 1,
    totalQuestions: questions?.length ?? 0,
    isLoading,
    error,
    handleResponse,
    goToQuestion,
    previousResponses,
  };
};