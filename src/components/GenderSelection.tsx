import { useState } from "react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      const { error } = await supabase
        .from('characters')
        .update({ 
          gender,
          status: 'race'
        })
        .eq('id', characterId);

      if (error) throw error;

      toast({
        description: "Gender selected successfully",
      });
      onGenderSelected();
    } catch (error) {
      console.error('Error updating gender:', error);
      toast({
        variant: "destructive",
        description: "Failed to save gender selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};