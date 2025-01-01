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
  onArmorSelected?: () => void;
}

export const ArmorSelection = ({ 
  characterId, 
  characterClass, 
  onBack,
  onArmorSelected 
}: ArmorSelectionProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArmorSelected = async (value: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log('Selecting armor:', value, 'for character:', characterId);
    
    try {
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          armor_type: value,
          status: 'morality'
        })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating armor:', updateError);
        throw updateError;
      }

      console.log('Armor selection saved successfully');
      showSuccessToast(toast, "Armor selected");
      
      if (onArmorSelected) {
        onArmorSelected();
      }
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
        nextStatus="morality"
        showBackButton={true}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};