import { BaseSelectionForm } from "./shared/BaseSelectionForm";
import { CLOTHING_OPTIONS } from "@/data/clothingOptions";
import { InfoTooltip } from "../shared/InfoTooltip";
import { supabase } from "@/integrations/supabase/client";

interface ClothingSelectionProps {
  characterId: string;
  characterClass: string;
  onBack: () => void;
  onClothingSelected: () => void;
}

export const ClothingSelection = ({ 
  characterId, 
  characterClass, 
  onBack, 
  onClothingSelected 
}: ClothingSelectionProps) => {
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

  const handleClothingSubmit = async (value: string) => {
    // First, check if there's an existing clothing record
    const { data: existingClothing } = await supabase
      .from('character_clothing')
      .select()
      .eq('character_id', characterId)
      .maybeSingle();

    if (existingClothing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('character_clothing')
        .update({ clothing_type: value })
        .eq('character_id', characterId);
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('character_clothing')
        .insert({ character_id: characterId, clothing_type: value });
      if (insertError) throw insertError;
    }

    // Update character status
    const { error: statusError } = await supabase
      .from('characters')
      .update({ status: 'armor' })
      .eq('id', characterId);
    if (statusError) throw statusError;
  };

  return (
    <div className="pt-16">
      <BaseSelectionForm
        title="Choose Clothing"
        options={optionsWithInfo}
        characterId={characterId}
        onSelected={onClothingSelected}
        onBack={onBack}
        updateField="clothing_type"
        nextStatus="armor"
        customSubmitHandler={handleClothingSubmit}
      />
    </div>
  );
};