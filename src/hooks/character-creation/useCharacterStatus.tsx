import { useState, useEffect } from "react";
import { CharacterStatus } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";

export const useCharacterStatus = (characterId: string | null) => {
  const [currentStep, setCurrentStep] = useState<CharacterStatus>("naming");

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
          console.log('Character status updated:', payload.new.status);
          if (payload.new?.status) {
            setCurrentStep(payload.new.status as CharacterStatus);
          }
        }
      )
      .subscribe();

    const fetchCharacterStatus = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('status')
        .eq('id', characterId)
        .single();

      if (!error && data) {
        console.log('Fetched character status:', data.status);
        setCurrentStep(data.status);
      }
    };

    fetchCharacterStatus();

    return () => {
      console.log('Cleaning up character status subscription');
      supabase.removeChannel(channel);
    };
  }, [characterId]);

  return { currentStep, setCurrentStep };
};