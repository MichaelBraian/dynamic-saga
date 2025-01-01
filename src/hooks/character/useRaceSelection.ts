import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseRaceSelectionProps {
  characterId: string;
  onRaceSelected: () => void;
}

export const useRaceSelection = ({ 
  characterId, 
  onRaceSelected 
}: UseRaceSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('id')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      const nextStatus = value === 'Animal' ? 'animal_type' : 'class';
      
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          race: value, 
          status: nextStatus 
        })
        .eq('id', characterId);

      if (updateError) throw updateError;
      
      console.log('Race selection saved successfully:', { characterId, race: value, nextStatus });

      toast({
        description: "Race selected successfully",
      });
      onRaceSelected();
    } catch (error) {
      console.error('Error updating race:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to save race selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleRaceSelected
  };
};