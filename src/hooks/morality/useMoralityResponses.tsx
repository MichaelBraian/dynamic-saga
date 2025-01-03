import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMoralityCalculation } from "./useMoralityCalculation";
import { useState, useCallback } from "react";

const REQUIRED_RESPONSES = 10;

export const useMoralityResponses = (characterId: string) => {
  const { toast } = useToast();
  const { calculateMoralityScore } = useMoralityCalculation();
  const [responses, setResponses] = useState<any[]>([]);

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

      // Then save the response
      const { error } = await supabase
        .from('character_responses')
        .insert([
          {
            character_id: characterId,
            question_id: questionId,
            answer,
          },
        ]);

      if (error) {
        console.error('Error saving response:', error);
        toast({
          variant: "destructive",
          description: "Failed to save your response. Please try again.",
        });
        return false;
      }

      console.log('Response saved successfully');

      // Update local responses
      const { data: updatedResponses, error: fetchError } = await supabase
        .from('character_responses')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching updated responses:', fetchError);
        return false;
      }

      if (!updatedResponses) {
        console.error('No responses found after saving');
        return false;
      }

      console.log('Current responses:', updatedResponses);
      setResponses(updatedResponses);

      // If we have all required responses, calculate morality
      if (updatedResponses.length >= REQUIRED_RESPONSES) {
        console.log('Required responses reached, calculating morality score');
        const calculationSuccess = await calculateMoralityScore(updatedResponses, character);
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