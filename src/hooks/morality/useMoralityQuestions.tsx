import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMoralityResponses } from "./useMoralityResponses";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Question = Database['public']['Tables']['questions']['Row'];

export const useMoralityQuestions = (characterId: string) => {
  const { toast } = useToast();
  const { saveResponse } = useMoralityResponses();

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

  const handleResponse = async (questionId: string, answer: string) => {
    if (!characterId) {
      toast({
        variant: "destructive",
        description: "No character ID provided.",
      });
      return false;
    }

    const success = await saveResponse(characterId, questionId, answer);
    
    if (!success) {
      toast({
        variant: "destructive",
        description: "Failed to save your response. Please try again.",
      });
    }

    return success;
  };

  return {
    questions,
    isLoading,
    error,
    handleResponse,
  };
}; 