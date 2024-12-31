import { useState } from "react";
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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArmorSelected = async (value: string) => {
    console.log('Handling armor selection:', value);
    setIsSubmitting(true);
    try {
      // Update both armor_type and status in a single operation
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          armor_type: value,
          status: 'morality'
        })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character:', updateError);
        throw updateError;
      }

      // Verify the update was successful
      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('status, armor_type')
        .eq('id', characterId)
        .single();

      if (verifyError) {
        console.error('Error verifying update:', verifyError);
        throw verifyError;
      }

      console.log('Character updated:', character);
      showSuccessToast(toast, "Armor selected");

      // Force a small delay to ensure the database update is complete
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);

    } catch (error) {
      console.error('Error in armor selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save armor selection. Please try again.",
      });
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
        nextStatus="morality"
        showBackButton={true}
      />
    </div>
  );
};