import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";

export const useCharacterSubscription = (
  characterId: string | null,
  updateCharacterState: (updates: { currentStep: CharacterStatus }) => void
) => {
  useEffect(() => {
    if (!characterId) return;

    console.log('Setting up character status subscription for:', characterId);
    
    const channel = supabase
      .channel(`character_status_${characterId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'characters',
          filter: `id=eq.${characterId}`,
        },
        (payload: any) => {
          console.log('Character status changed:', payload.new.status);
          const newStatus = payload.new.status as CharacterStatus;
          updateCharacterState({ currentStep: newStatus });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up character status subscription');
      void supabase.removeChannel(channel);
    };
  }, [characterId, updateCharacterState]);
};