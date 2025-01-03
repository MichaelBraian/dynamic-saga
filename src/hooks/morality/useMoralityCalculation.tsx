import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

type CharacterMorality = Database['public']['Tables']['character_morality']['Row'];
type CharacterResponse = Database['public']['Tables']['character_responses']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type Character = Database['public']['Tables']['characters']['Row'];

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useMoralityCalculation = () => {
  const { toast } = useToast();

  const calculateMoralityScore = useCallback(async (responses: CharacterResponse[], character: Character) => {
    if (!character) {
      console.error('No character provided for morality calculation');
      toast({
        variant: "destructive",
        description: "No character found to calculate morality score.",
      });
      return false;
    }

    try {
      // Log the start of calculation
      console.log('Starting morality calculation for character:', character.id);
      console.log('Number of responses:', responses.length);
      console.log('Responses:', responses);

      // Fetch questions with retry logic
      let questions: Question[] | null = null;
      let retryCount = 0;

      while (!questions && retryCount < MAX_RETRIES) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .in('id', responses.map(r => r.question_id));

        if (error) {
          console.error(`Attempt ${retryCount + 1} to fetch questions failed:`, error);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }

        if (!data || data.length === 0) {
          console.error(`Attempt ${retryCount + 1}: No questions found for IDs:`, responses.map(r => r.question_id));
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }

        questions = data;
      }

      if (!questions) {
        throw new Error('Failed to fetch questions after multiple attempts');
      }

      console.log('Successfully fetched questions:', questions);

      let goodEvilScale = 0;
      let lawfulChaoticScale = 0;
      let goodEvilCount = 0;
      let lawfulChaoticCount = 0;
      const questionsMap = new Map(questions.map(q => [q.id, q]));

      // Process each response
      responses.forEach((response) => {
        const question = questionsMap.get(response.question_id);
        if (!question) {
          console.error('Question not found for response:', response);
          return;
        }

        // Extract the response value
        const match = response.answer.match(/^(\d+)\./);
        if (!match) {
          console.error('Invalid answer format:', response.answer);
          return;
        }

        const responseValue = parseInt(match[1]);
        if (isNaN(responseValue)) {
          console.error('Invalid response value:', match[1]);
          return;
        }
        
        // Calculate scaled value for option 4 (pure evil/chaotic) to option 1 (pure good/lawful)
        // Option 4 = -100 (pure evil/chaotic)
        // Option 3 = -33
        // Option 2 = +33
        // Option 1 = +100 (pure good/lawful)
        const scaledValue = -100 + ((4 - responseValue) * 66);
        
        console.log(`Response for question ${question.id}:`, {
          originalValue: responseValue,
          scaledValue,
          questionWeight: question.morality_weight,
          answer: response.answer
        });
        
        // Add to appropriate scale based on question weight
        if (question.morality_weight > 0) {
          goodEvilScale += scaledValue;
          goodEvilCount++;
        } else {
          lawfulChaoticScale += scaledValue;
          lawfulChaoticCount++;
        }
      });

      // Validate counts
      if (goodEvilCount + lawfulChaoticCount !== responses.length) {
        console.error('Response count mismatch:', {
          totalResponses: responses.length,
          goodEvilCount,
          lawfulChaoticCount,
          responses
        });
      }

      // Calculate average scores
      goodEvilScale = Math.round(goodEvilScale / (goodEvilCount || 1));
      lawfulChaoticScale = Math.round(lawfulChaoticScale / (lawfulChaoticCount || 1));

      // Ensure scores are within bounds
      goodEvilScale = Math.max(-100, Math.min(100, goodEvilScale));
      lawfulChaoticScale = Math.max(-100, Math.min(100, lawfulChaoticScale));

      // Calculate overall alignment score (0-100)
      // For pure evil/chaotic (-100/-100), this should be 0 (devil)
      // For pure good/lawful (+100/+100), this should be 100 (angel)
      const alignmentScore = Math.round(100 - (Math.abs(goodEvilScale) + Math.abs(lawfulChaoticScale)) / 2);

      console.log('Final scores:', {
        goodEvilScale,
        lawfulChaoticScale,
        alignmentScore,
        responses: responses.length,
        goodEvilCount,
        lawfulChaoticCount
      });

      const moralityData = {
        character_id: character.id,
        good_evil_scale: goodEvilScale,
        lawful_chaotic_scale: lawfulChaoticScale,
        alignment_score: alignmentScore,
      };

      console.log('Saving morality data:', moralityData);

      // Delete existing record with retry logic
      retryCount = 0;
      while (retryCount < MAX_RETRIES) {
        const { error: deleteError } = await supabase
          .from('character_morality')
          .delete()
          .eq('character_id', character.id);

        if (!deleteError) {
          console.log('Successfully deleted existing morality record');
          break;
        }

        console.error(`Attempt ${retryCount + 1} to delete existing record failed:`, deleteError);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }

      // Insert new record with retry logic
      retryCount = 0;
      let insertSuccess = false;

      while (!insertSuccess && retryCount < MAX_RETRIES) {
        const { error: insertError } = await supabase
          .from('character_morality')
          .insert([moralityData]);

        if (!insertError) {
          console.log('Successfully inserted new morality record');
          insertSuccess = true;
          break;
        }

        console.error(`Attempt ${retryCount + 1} to insert morality score failed:`, insertError);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }

      if (!insertSuccess) {
        throw new Error('Failed to insert morality score after multiple attempts');
      }

      // Verify the record was inserted with retry logic
      retryCount = 0;
      let verificationSuccess = false;

      while (!verificationSuccess && retryCount < MAX_RETRIES) {
        const { data: verifyData, error: verifyError } = await supabase
          .from('character_morality')
          .select('*')
          .eq('character_id', character.id)
          .single();

        if (!verifyError && verifyData) {
          console.log('Morality score verified:', verifyData);
          verificationSuccess = true;
          break;
        }

        console.error(`Attempt ${retryCount + 1} to verify morality score failed:`, verifyError);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }

      if (!verificationSuccess) {
        throw new Error('Failed to verify morality score after insertion');
      }

      return true;
    } catch (error) {
      console.error('Error in calculateMoralityScore:', error);
      toast({
        variant: "destructive",
        description: "Failed to calculate morality score. Please try again.",
      });
      return false;
    }
  }, [toast]);

  return { calculateMoralityScore };
};