import { useState } from "react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RaceSelectionProps {
  characterId: string;
  onRaceSelected: () => void;
  onBack: () => void;
}

const RACE_OPTIONS = [
  { value: 'Human', label: 'Human' },
  { value: 'Dwarf', label: 'Dwarf' },
  { value: 'Animal', label: 'Animal' }
];

export const RaceSelection = ({ characterId, onRaceSelected, onBack }: RaceSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRaceSelected = async (value: string) => {
    if (!value || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select a race to continue",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update the next status based on the selected race
      const nextStatus = value === 'Animal' ? 'animal_type' : 'class';
      
      const { error } = await supabase
        .from('characters')
        .update({ 
          race: value, 
          status: nextStatus 
        })
        .eq('id', characterId);

      if (error) throw error;
      
      toast({
        description: "Race selected successfully",
      });
      onRaceSelected();
    } catch (error) {
      console.error('Error updating race:', error);
      toast({
        variant: "destructive",
        description: "Failed to save race selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CharacterSelectionScreen
      title="Choose Race"
      options={RACE_OPTIONS}
      characterId={characterId}
      onSelected={handleRaceSelected}
      onBack={onBack}
      updateField="race"
      nextStatus="class"
      isSubmitting={isSubmitting}
    />
  );
};