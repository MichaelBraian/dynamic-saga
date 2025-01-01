import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { useGenderSelection } from "@/hooks/character/useGenderSelection";

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
  const { isSubmitting, handleGenderSelected } = useGenderSelection({
    characterId,
    onGenderSelected
  });

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