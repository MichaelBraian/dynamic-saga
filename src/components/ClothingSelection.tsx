import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
}

export const ClothingSelection = ({ characterId, characterClass, onBack }: ClothingSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClothingSelected = async (value: string) => {
    setIsSubmitting(true);
    try {
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'questioning' })
        .eq('id', characterId);

      if (statusError) throw statusError;

      const { error: clothingError } = await supabase
        .from('character_clothing')
        .insert({ character_id: characterId, clothing_type: value });

      if (clothingError) throw clothingError;

      showSuccessToast(toast, "Clothing selected");
      navigate("/");
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
        nextStatus="questioning"
      />
    </div>
  );
};