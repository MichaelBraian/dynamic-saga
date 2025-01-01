import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CharacterStatus } from "@/types/character";

export const useCharacterCleanup = (characterId: string | null) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!characterId) return;

    // Cleanup function for character creation
    const cleanup = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check for abandoned character creation sessions
        const { data: character, error } = await supabase
          .from('characters')
          .select('status, created_at')
          .eq('id', characterId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (!character) return;

        // If character creation was abandoned for more than 24 hours, reset to last valid state
        const createdAt = new Date(character.created_at);
        const now = new Date();
        const hoursDiff = Math.abs(now.getTime() - createdAt.getTime()) / 36e5;

        if (hoursDiff > 24) {
          const lastValidState = getLastValidState(character.status as CharacterStatus);
          await supabase
            .from('characters')
            .update({ status: lastValidState })
            .eq('id', characterId)
            .eq('user_id', user.id);

          toast({
            description: "Character creation session was restored to last valid state.",
          });
        }
      } catch (error) {
        console.error('Error in character cleanup:', error);
      }
    };

    cleanup();

    return () => {
      // Cleanup subscriptions when component unmounts
      const channel = supabase.channel(`character_${characterId}`);
      supabase.removeChannel(channel);
    };
  }, [characterId, toast]);
};

const getLastValidState = (currentStatus: CharacterStatus): CharacterStatus => {
  const validStates: CharacterStatus[] = [
    "naming",
    "gender",
    "race",
    "animal_type",
    "class",
    "clothing",
    "armor",
    "morality",
    "attributes"
  ];

  const currentIndex = validStates.indexOf(currentStatus);
  if (currentIndex <= 0) return "naming";
  return validStates[currentIndex - 1];
};