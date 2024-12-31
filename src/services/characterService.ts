import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";

export const createCharacter = async (name: string, userId: string) => {
  const { data, error } = await supabase
    .from('characters')
    .insert([{
      name: name.trim(),
      user_id: userId,
      status: 'naming'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCharacterField = async (
  characterId: string,
  field: string,
  value: string,
  nextStatus: CharacterStatus
) => {
  const { error } = await supabase
    .from('characters')
    .update({ [field]: value, status: nextStatus })
    .eq('id', characterId);

  if (error) throw error;
};

export const checkCharacterNameExists = async (name: string, userId: string) => {
  const { data, error } = await supabase
    .from('characters')
    .select('id')
    .eq('user_id', userId)
    .eq('name', name.trim())
    .maybeSingle();

  if (error) throw error;
  return data;
};