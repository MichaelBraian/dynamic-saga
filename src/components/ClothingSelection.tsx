import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { CLOTHING_OPTIONS } from "@/data/clothingOptions";
import { InfoTooltip } from "./shared/InfoTooltip";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

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

  if (isSubmitting) {
    return (
      <div className="pt-16">
        <SelectionLoadingState message="Saving clothing selection..." />
      </div>
    );
  }

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
          title="Choose Clothing"
          options={optionsWithInfo}
          characterId={characterId}
          onSelected={handleSelected}
          onBack={onBack}
          updateField="clothing_type"
          nextStatus="armor"
        />
      </div>
    </ErrorBoundary>
  );
};