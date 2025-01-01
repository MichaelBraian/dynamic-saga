import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CLOTHING_OPTIONS } from "@/data/clothingOptions";
import { showSuccessToast } from "@/utils/toast";
import { InfoTooltip } from "@/components/shared/InfoTooltip";

interface ClothingOption {
  value: string;
  label: string;
  labelComponent?: React.ReactNode;
}

export const useClothingSelection = (
  characterId: string,
  characterClass: string,
  onClothingSelected: () => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSelected = async (value: string) => {
    setIsSubmitting(true);
    try {
      // Verify character ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, class')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Validate clothing selection based on class
      if (!CLOTHING_OPTIONS[character.class]?.some(option => option.value === value)) {
        throw new Error(`Invalid clothing selection for ${character.class}. Please choose a valid option.`);
      }

      // Save clothing selection
      const { error: saveError } = await supabase
        .from('character_clothing')
        .insert({
          character_id: characterId,
          clothing_type: value
        });

      if (saveError) throw saveError;

      // Update character status to 'armor'
      const { error: updateError } = await supabase
        .from('characters')
        .update({ status: 'armor' })
        .eq('id', characterId);

      if (updateError) throw updateError;

      await onClothingSelected();
      showSuccessToast(toast, "Clothing selected successfully");
    } catch (error) {
      console.error('Error selecting clothing:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to select clothing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    options: optionsWithInfo,
    handleSelected
  };
};