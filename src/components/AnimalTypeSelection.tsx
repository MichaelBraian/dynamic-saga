import { useState } from "react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useToast } from "@/hooks/use-toast";
import { InfoTooltip } from "./shared/InfoTooltip";
import { supabase } from "@/integrations/supabase/client";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";

interface AnimalTypeSelectionProps {
  characterId: string;
  onBack: () => void;
  onAnimalTypeSelected: (animalType: string) => void;
}

const ANIMAL_TYPES = [
  { value: 'Lion', label: 'Lion', description: 'A majestic big cat known for its strength, leadership, and fierce loyalty to its pride.' },
  { value: 'Wolf', label: 'Wolf', description: 'A social predator that excels in pack tactics, known for its intelligence and endurance.' },
  { value: 'Snake', label: 'Snake', description: 'A stealthy reptile with lightning-fast reflexes and deadly precision.' },
  { value: 'Fox', label: 'Fox', description: 'A clever and adaptable creature known for its wit and agility.' },
  { value: 'Bear', label: 'Bear', description: 'A powerful omnivore combining immense strength with surprising intelligence.' },
];

export const AnimalTypeSelection = ({ characterId, onBack, onAnimalTypeSelected }: AnimalTypeSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSelected = async (value: string) => {
    if (!value || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select an animal type to continue",
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
        .select('user_id, status')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      const { error } = await supabase
        .from('characters')
        .update({ 
          animal_type: value,
          status: 'class'
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        description: "Animal type selected successfully",
      });
      onAnimalTypeSelected(value);
    } catch (error) {
      console.error('Error updating animal type:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to save animal type selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const animalTypesWithInfo = ANIMAL_TYPES.map(option => ({
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
        <SelectionLoadingState message="Saving animal type selection..." />
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
          title="Choose Animal Type"
          options={animalTypesWithInfo}
          characterId={characterId}
          onSelected={handleSelected}
          onBack={onBack}
          updateField="animal_type"
          nextStatus="class"
          isSubmitting={isSubmitting}
        />
      </div>
    </ErrorBoundary>
  );
};