import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { useArmorSelection } from "@/hooks/character/useArmorSelection";
import { ArmorOptions } from "./armor/ArmorOptions";

interface ArmorSelectionProps {
  characterId: string;
  characterClass: string;
  onBack: () => void;
  onArmorSelected?: () => void;
}

export const ArmorSelection = ({ 
  characterId, 
  characterClass, 
  onBack,
  onArmorSelected 
}: ArmorSelectionProps) => {
  const { isSubmitting, handleArmorSelected } = useArmorSelection({
    characterId,
    onArmorSelected
  });

  if (isSubmitting) {
    return (
      <div className="pt-16">
        <SelectionLoadingState message="Saving armor selection..." />
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
          title="Choose Armor"
          options={ArmorOptions({ characterClass })}
          characterId={characterId}
          onSelected={handleArmorSelected}
          onBack={onBack}
          updateField="armor_type"
          nextStatus="morality"
          showBackButton={true}
          isSubmitting={isSubmitting}
        />
      </div>
    </ErrorBoundary>
  );
};