import { useState } from "react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";

interface GenderSelectionProps {
  characterId: string;
  onGenderSelected: () => void;
  onBack: () => void;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export const GenderSelection = ({ characterId, onGenderSelected, onBack }: GenderSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleGenderSelected = async (gender: string) => {
    if (!gender || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select a gender to continue",
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
        .select('user_id')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Update gender
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          gender,
          status: 'race'
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        description: "Gender selected successfully",
      });
      onGenderSelected();
    } catch (error) {
      console.error('Error updating gender:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to save gender selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="pt-16">
        <SelectionLoadingState message="Saving gender selection..." />
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
          title="Choose Gender"
          options={GENDER_OPTIONS}
          characterId={characterId}
          onSelected={handleGenderSelected}
          onBack={onBack}
          updateField="gender"
          nextStatus="race"
          isSubmitting={isSubmitting}
        />
      </div>
    </ErrorBoundary>
  );
};