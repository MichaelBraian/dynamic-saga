import { useState } from "react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { ARMOR_OPTIONS } from "@/data/armorOptions";
import { InfoTooltip } from "./shared/InfoTooltip";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";

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
      // Verify character exists and belongs to current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, class, status')
        .eq('id', characterId)
        .single();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Validate armor selection based on class
      if (!ARMOR_OPTIONS[character.class]?.some(option => option.value === value)) {
        throw new Error(`Invalid armor selection for ${character.class}. Please choose a valid option.`);
      }

      // Update armor selection
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          armor_type: value,
          status: 'morality'
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      console.log('Armor selection saved successfully');
      showSuccessToast(toast, "Armor selected successfully");
      
      if (onArmorSelected) {
        onArmorSelected();
      }
    } catch (error) {
      console.error('Error saving armor selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to save armor selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="pt-16">
        <SelectionLoadingState message="Saving armor selection..." />
      </div>
    );
  }

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
    <ErrorBoundary
      fallback={
        <div className="text-white bg-red-500/20 p-4 rounded-lg">
          Something went wrong. Please refresh and try again.
        </div>
      }
    >
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
    </ErrorBoundary>
  );
};