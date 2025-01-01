import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ANIMAL_TYPES } from "@/data/animalTypeOptions";

export const useAnimalTypeSelection = (
  characterId: string,
  onAnimalTypeSelected: (animalType: string) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateAnimalType = (value: string): boolean => {
    return ANIMAL_TYPES.some(type => type.value === value);
  };

  const handleSelected = async (value: string) => {
    if (!value || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select an animal type to continue",
      });
      return;
    }

    if (!validateAnimalType(value)) {
      toast({
        variant: "destructive",
        description: "Invalid animal type selected",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('id, race')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.race !== 'Animal') {
        throw new Error("Only Animal race can select animal type");
      }

      const { error } = await supabase
        .from('characters')
        .update({ 
          animal_type: value,
          status: 'class'
        })
        .eq('id', characterId);

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