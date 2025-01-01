import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { useGenderSelection } from "@/hooks/character/useGenderSelection";
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

export const GenderSelection = ({ 
  characterId, 
  onGenderSelected, 
  onBack 
}: GenderSelectionProps) => {
  const { toast } = useToast();
  const { isSubmitting, handleGenderSelected } = useGenderSelection({
    characterId,
    onGenderSelected
  });

  const handleSelection = async (gender: string) => {
    try {
      if (!characterId) {
        toast({
          variant: "destructive",
          description: "Character ID is missing. Please try again.",
        });
        return;
      }
      await handleGenderSelected(gender);
    } catch (error) {
      console.error('Error in gender selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save gender selection. Please try again.",
      });
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
          onSelected={handleSelection}
          onBack={onBack}
          updateField="gender"
          nextStatus="race"
          isSubmitting={isSubmitting}
        />
      </div>
    </ErrorBoundary>
  );
};