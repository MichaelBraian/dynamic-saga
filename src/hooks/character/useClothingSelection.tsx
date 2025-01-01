import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CLOTHING_OPTIONS } from "@/data/clothingOptions";
import { showSuccessToast } from "@/utils/toast";
import { InfoTooltip } from "@/components/shared/InfoTooltip";

interface ClothingOption {
  value: string;
  label: string;
}

export const useClothingSelection = (
  characterId: string,
  characterClass: string,
  onClothingSelected: () => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = CLOTHING_OPTIONS[characterClass] || [];
  const optionsWithInfo = options.map(option => ({
    value: option.value,
    label: option.value,
    labelComponent: (
      <div className="flex items-center gap-2">
        {option.value}
        <InfoTooltip content={option.label} />
      </div>
    ),
  }));

  const validateClothingSelection = (value: string): boolean => {
    if (!characterClass) {
      setError("Character class is required for clothing selection");
      return false;
    }

    if (!CLOTHING_OPTIONS[characterClass]) {
      setError(`No clothing options available for class: ${characterClass}`);
      return false;
    }

    if (!CLOTHING_OPTIONS[characterClass].some(option => option.value === value)) {
      setError(`Invalid clothing selection for ${characterClass}`);
      return false;
    }

    return true;
  };

  const handleSelected = async (value: string) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate selection
      if (!validateClothingSelection(value)) {
        throw new Error("Invalid clothing selection");
      }

      // Verify character ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Authentication required");
      }

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, class')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError) {
        console.error('Error verifying character:', verifyError);
        throw new Error("Failed to verify character ownership");
      }

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("You don't have permission to modify this character");
      }

      // Save clothing selection
      const { error: saveError } = await supabase
        .from('character_clothing')
        .insert({
          character_id: characterId,
          clothing_type: value
        });

      if (saveError) {
        console.error('Error saving clothing:', saveError);
        throw new Error("Failed to save clothing selection");
      }

      // Update character status
      const { error: updateError } = await supabase
        .from('characters')
        .update({ status: 'armor' })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating status:', updateError);
        throw new Error("Failed to update character status");
      }

      showSuccessToast(toast, "Clothing selected successfully");
      await onClothingSelected();
    } catch (error) {
      console.error('Error in clothing selection:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to select clothing";
      setError(errorMessage);
      toast({
        variant: "destructive",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    options: optionsWithInfo,
    handleSelected
  };
};