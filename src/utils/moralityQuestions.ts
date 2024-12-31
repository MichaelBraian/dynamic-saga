import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";
import { MoralityQuestion } from "@/types/morality";

export const getMoralityQuestionOptions = (questionText: string) => {
  const options = questionText
    .split('\n')
    .slice(1)
    .map(option => option.trim())
    .filter(option => option.match(/^\d\./))
    .map(option => ({
      value: option,
      label: option
    }));

  return options;
};

export const fetchMoralityQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category', 'morality');

  if (error) throw error;
  return data as MoralityQuestion[];
};

export const saveMoralityResponse = async (characterId: string, questionId: string, answer: string) => {
  const { error } = await supabase
    .from('character_responses')
    .insert({
      character_id: characterId,
      question_id: questionId,
      answer: answer
    });

  if (error) throw error;
};

export const updateCharacterStatus = async (characterId: string, status: CharacterStatus) => {
  const { error } = await supabase
    .from('characters')
    .update({ status })
    .eq('id', characterId);

  if (error) throw error;
};