import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { useRaceSelection } from "@/hooks/character/useRaceSelection";

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

export const RaceSelection = ({ 
  characterId, 
  onRaceSelected, 
  onBack 
}: RaceSelectionProps) => {
  const { isSubmitting, handleRaceSelected } = useRaceSelection({
    characterId,
    onRaceSelected
  });

  if (isSubmitting) {
    return (
      <div className="pt-16">
        <SelectionLoadingState message="Saving race selection..." />
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
          title="Choose Race"
          options={RACE_OPTIONS}
          characterId={characterId}
          onSelected={handleRaceSelected}
          onBack={onBack}
          updateField="race"
          nextStatus="class"
          isSubmitting={isSubmitting}
        />
      </div>
    </ErrorBoundary>
  );
};