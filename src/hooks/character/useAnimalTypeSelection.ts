import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAnimalTypeSelection = (
  characterId: string,
  onAnimalTypeSelected: (animalType: string) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSelected = async (value: string) => {
    if (!value || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select an animal type to continue",
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
        .select('user_id, status')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      const { error } = await supabase
        .from('characters')
        .update({ 
          animal_type: value,
          status: 'class'
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        description: "Animal type selected successfully",
      });
      onAnimalTypeSelected(value);
    } catch (error) {
      console.error('Error updating animal type:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to save animal type selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSelected
  };
};