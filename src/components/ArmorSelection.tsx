import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { ARMOR_OPTIONS } from "@/data/armorOptions";
import { InfoTooltip } from "./shared/InfoTooltip";

interface ArmorSelectionProps {
  characterId: string;
  characterClass: string;
  onBack: () => void;
}

export const ArmorSelection = ({ characterId, characterClass, onBack }: ArmorSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArmorSelected = async (value: string) => {
    setIsSubmitting(true);
    try {
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'questioning', armor_type: value })
        .eq('id', characterId);

      if (statusError) throw statusError;

      showSuccessToast(toast, "Armor selected");
      navigate("/");
    } catch (error) {
      console.error('Error saving armor selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save armor selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = ARMOR_OPTIONS[characterClass] || [];
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
        title="Choose Armor"
        options={optionsWithInfo}
        characterId={characterId}
        onSelected={handleArmorSelected}
        onBack={onBack}
        updateField="armor_type"
        nextStatus="questioning"
      />
    </div>
  );
};