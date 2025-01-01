import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { CLASS_OPTIONS } from "@/data/classOptions";
import { InfoTooltip } from "./shared/InfoTooltip";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { useClassSelection } from "@/hooks/character/useClassSelection";

interface ClassSelectionProps {
  characterId: string;
  onBack: () => void;
  onClassSelected: (characterClass: string) => void;
}

export const ClassSelection = ({ 
  characterId, 
  onBack, 
  onClassSelected 
}: ClassSelectionProps) => {
  const { isSubmitting, handleSelected } = useClassSelection(characterId, onClassSelected);

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