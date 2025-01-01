import { useState } from "react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { CLASS_OPTIONS } from "@/data/classOptions";
import { InfoTooltip } from "./shared/InfoTooltip";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";

interface ClassSelectionProps {
  characterId: string;
  onBack: () => void;
  onClassSelected: (characterClass: string) => void;
}

export const ClassSelection = ({ characterId, onBack, onClassSelected }: ClassSelectionProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelected = async (value: string) => {
    if (!value) {
      toast({
        variant: "destructive",
        description: "Please select a class to continue",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Verify character ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, race')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Validate class selection based on race
      if (character.race === 'Animal' && ['Paladin', 'Artificer'].includes(value)) {
        throw new Error(`${character.race}s cannot be ${value}s. Please choose a different class.`);
      }

      await onClassSelected(value);
      showSuccessToast(toast, "Class selected successfully");
    } catch (error) {
      console.error('Error selecting class:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to select class. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const classOptionsWithInfo = CLASS_OPTIONS.map(option => ({
    value: option.value,
    label: option.value,
    labelComponent: (
      <div className="flex items-center gap-2">
        {option.value}
        <InfoTooltip content={option.description} />
      </div>
    ),
  }));

  if (isSubmitting) {
    return (
      <div className="pt-16">
        <SelectionLoadingState message="Saving class selection..." />
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
          title="Choose Class"
          options={classOptionsWithInfo}
          characterId={characterId}
          onSelected={handleSelected}
          onBack={onBack}
          updateField="class"
          nextStatus="clothing"
          isSubmitting={isSubmitting}
        />
      </div>
    </ErrorBoundary>
  );
};