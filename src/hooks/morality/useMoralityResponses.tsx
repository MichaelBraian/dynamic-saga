import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMoralityCalculation } from "./useMoralityCalculation";
import { useState, useCallback } from "react";
import { Database } from "@/integrations/supabase/types";

const REQUIRED_RESPONSES = 10;

type CharacterResponse = Database['public']['Tables']['character_responses']['Row'];

export const useMoralityResponses = (characterId: string) => {
  const { toast } = useToast();
  const { calculateMoralityScore } = useMoralityCalculation();
  const [responses, setResponses] = useState<CharacterResponse[]>([]);

  const getCharacter = async () => {
    const { data: character, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();
    
    if (error) {
      console.error('Error fetching character:', error);
      return null;
    }
    
    return character;
  };

  const fetchLatestResponses = async () => {
    const { data: responses, error } = await supabase
      .from('character_responses')
      .select('*')
      .eq('character_id', characterId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching responses:', error);
      return null;
    }

    // Get unique responses (latest response for each question)
    const uniqueResponses = Object.values(
      responses.reduce((acc: Record<string, CharacterResponse>, curr: CharacterResponse) => {
        if (!acc[curr.question_id] || new Date(curr.created_at) > new Date(acc[curr.question_id].created_at)) {
          acc[curr.question_id] = curr;
        }
        return acc;
      }, {})
    ) as CharacterResponse[];

    return uniqueResponses;
  };

  const saveResponse = useCallback(async (answer: string, questionId: string) => {
    try {
      if (!characterId) {
        console.error('No character ID provided');
        toast({
          variant: "destructive",
          description: "Character ID is missing. Please try again.",
        });
        return false;
      }

      console.log('Saving response:', { characterId, questionId, answer });

      // First verify the character exists
      const character = await getCharacter();
      if (!character) {
        console.error('Character not found:', characterId);
        toast({
          variant: "destructive",
          description: "Character not found. Please try again.",
        });
        return false;
      }

      console.log('Character found:', character);

      // Delete any existing response for this question
      const { error: deleteError } = await supabase
        .from('character_responses')
        .delete()
        .eq('character_id', characterId)
        .eq('question_id', questionId);

      if (deleteError) {
        console.error('Error deleting existing response:', deleteError);
        toast({
          variant: "destructive",
          description: "Failed to update your response. Please try again.",
        });
        return false;
      }

      // Then save the new response
      const { error: insertError } = await supabase
        .from('character_responses')
        .insert([
          {
            character_id: characterId,
            question_id: questionId,
            answer,
          },
        ]);

      if (insertError) {
        console.error('Error saving response:', insertError);
        toast({
          variant: "destructive",
          description: "Failed to save your response. Please try again.",
        });
        return false;
      }

      console.log('Response saved successfully');

      // Fetch latest responses
      const uniqueResponses = await fetchLatestResponses();
      if (!uniqueResponses) {
        console.error('Failed to fetch updated responses');
        return false;
      }

      console.log('Current unique responses:', uniqueResponses);
      setResponses(uniqueResponses);

      // If we have all required responses, calculate morality
      if (uniqueResponses.length >= REQUIRED_RESPONSES) {
        console.log('Required responses reached, calculating morality score');
        const calculationSuccess = await calculateMoralityScore(uniqueResponses, character);
        return calculationSuccess;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error in saveResponse:', error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    }
  }, [characterId, toast, calculateMoralityScore]);

  return { saveResponse, responses };
};