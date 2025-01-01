import { useEffect } from "react";
import { CharacterStatus } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";

export const useCharacterSubscription = (
  characterId: string | null,
  currentStep: CharacterStatus
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
          if (newStatus === 'attributes' && currentStep === 'morality') {
            console.log('Transitioning from morality to attributes step');
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up character status subscription');
      supabase.removeChannel(channel);
    };
  }, [characterId, currentStep]);
};