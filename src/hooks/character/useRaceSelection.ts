import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCharacterVerification } from "./useCharacterVerification";

interface UseRaceSelectionProps {
  characterId: string;
  onRaceSelected: () => Promise<void>;
}

export const useRaceSelection = ({ 
  characterId, 
  onRaceSelected 
}: UseRaceSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { verifyCharacter } = useCharacterVerification();

  const handleRaceSelected = async (value: string) => {
    if (!value || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select a race to continue",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Handling race selection:', { characterId, race: value });

      await verifyCharacter(characterId);
      
      const nextStatus = value === 'Animal' ? 'animal_type' : 'class';
      
      const { data, error: updateError } = await supabase
        .from('characters')
        .update({ 
          race: value, 
          status: nextStatus 
        })
        .eq('id', characterId)
        .select();

      if (updateError) {
        console.error('Database error:', updateError);
        throw updateError;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from update');
      }
      
      console.log('Race selection saved successfully:', { 
        characterId, 
        race: value, 
        nextStatus,
        response: data 
      });

      await onRaceSelected();
      
      toast({
        description: "Race selected successfully",
      });
    } catch (error) {
      console.error('Error updating race:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to save race selection. Please try again.",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleRaceSelected
  };
};