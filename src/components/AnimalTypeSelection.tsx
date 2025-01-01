import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { InfoTooltip } from "./shared/InfoTooltip";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { ANIMAL_TYPES } from "@/data/animalTypeOptions";
import { useAnimalTypeSelection } from "@/hooks/character/useAnimalTypeSelection";

interface AnimalTypeSelectionProps {
  characterId: string;
  onBack: () => void;
  onAnimalTypeSelected: (animalType: string) => void;
}

export const AnimalTypeSelection = ({ 
  characterId, 
  onBack, 
  onAnimalTypeSelected 
}: AnimalTypeSelectionProps) => {
  const { isSubmitting, handleSelected } = useAnimalTypeSelection(
    characterId,
    onAnimalTypeSelected
  );

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