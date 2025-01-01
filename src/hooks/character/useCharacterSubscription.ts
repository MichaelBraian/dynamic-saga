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
          if (newStatus !== currentStep) {
            console.log('Status changed from', currentStep, 'to', newStatus);
            window.location.reload();
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up character status subscription');
      void supabase.removeChannel(channel);
    };
  }, [characterId, currentStep]);
};