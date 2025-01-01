import { useState } from "react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { CLASS_OPTIONS } from "@/data/classOptions";
import { InfoTooltip } from "./shared/InfoTooltip";
import { LoadingSpinner } from "./shared/LoadingSpinner";

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
      await onClassSelected(value);
      showSuccessToast(toast, "Class selected successfully");
    } catch (error) {
      console.error('Error selecting class:', error);
      toast({
        variant: "destructive",
        description: "Failed to select class. Please try again.",
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
      <div className="flex items-center justify-center pt-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
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
  );
};