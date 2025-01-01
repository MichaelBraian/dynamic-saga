import { InfoTooltip } from "./shared/InfoTooltip";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useClothingSelection } from "@/hooks/character/useClothingSelection";

interface ClothingSelectionProps {
  characterId: string;
  characterClass: string;
  onBack: () => void;
  onClothingSelected: () => void;
}

export const ClothingSelection = ({ 
  characterId, 
  characterClass, 
  onBack, 
  onClothingSelected 
}: ClothingSelectionProps) => {
  const {
    isSubmitting,
    options,
    handleSelected
  } = useClothingSelection(characterId, characterClass, onClothingSelected);

  if (isSubmitting) {
    return (
      <div className="pt-16">
        <SelectionLoadingState message="Saving clothing selection..." />
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
          title="Choose Clothing"
          options={options}
          characterId={characterId}
          onSelected={handleSelected}
          onBack={onBack}
          updateField="clothing_type"
          nextStatus="armor"
        />
      </div>
    </ErrorBoundary>
  );
};