import { supabase } from "@/integrations/supabase/client";

export interface MoralityQuestion {
  id: string;
  question_text: string;
  morality_weight: number;
  category: string;
}

export const fetchMoralityQuestion = async (questionId?: string) => {
  const query = supabase
    .from('questions')
    .select('*')
    .eq('category', 'morality');

  if (questionId) {
    query.neq('id', questionId); // Exclude current question
  }

  const { data, error } = await query.limit(1).single();

  if (error) throw error;
  return data;
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

export const updateCharacterStatus = async (characterId: string, status: string) => {
  const { error } = await supabase
    .from('characters')
    .update({ status })
    .eq('id', characterId)
    .select();

  if (error) throw error;
};

export const formatQuestionOptions = (questionText: string) => {
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