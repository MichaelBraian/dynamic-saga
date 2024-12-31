import { useState } from "react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { CLOTHING_OPTIONS } from "@/data/clothingOptions";
import { InfoTooltip } from "./shared/InfoTooltip";

interface ClothingSelectionProps {
  characterId: string;
  characterClass: string;
  onBack: () => void;
  onClothingSelected: () => void;
}

export const ClothingSelection = ({ characterId, characterClass, onBack, onClothingSelected }: ClothingSelectionProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClothingSelected = async (value: string) => {
    setIsSubmitting(true);
    try {
      // First check if clothing record exists
      const { data: existingClothing, error: queryError } = await supabase
        .from('character_clothing')
        .select()
        .eq('character_id', characterId)
        .maybeSingle();

      if (queryError) throw queryError;

      let clothingError;
      if (existingClothing) {
        // Update existing record
        const { error } = await supabase
          .from('character_clothing')
          .update({ clothing_type: value })
          .eq('character_id', characterId);
        clothingError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('character_clothing')
          .insert({ character_id: characterId, clothing_type: value });
        clothingError = error;
      }

      if (clothingError) throw clothingError;

      // Update character status to armor after successful clothing selection
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'armor' })
        .eq('id', characterId);

      if (statusError) throw statusError;

      showSuccessToast(toast, "Clothing selected");
      onClothingSelected();
    } catch (error) {
      console.error('Error saving clothing selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save clothing selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Clothing"
        options={optionsWithInfo}
        characterId={characterId}
        onSelected={handleClothingSelected}
        onBack={onBack}
        updateField="clothing_type"
        nextStatus="armor"
      />
    </div>
  );
};