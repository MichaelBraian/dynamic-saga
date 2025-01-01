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
      // Verify character ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Update the next status based on the selected race
      const nextStatus = value === 'Animal' ? 'animal_type' : 'class';
      
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          race: value, 
          status: nextStatus 
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      
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