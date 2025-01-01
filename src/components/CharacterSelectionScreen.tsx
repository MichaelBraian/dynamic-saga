import { CharacterStatus } from "@/types/character";
import { SelectionForm } from "./character-selection/SelectionForm";
import { ClothingForm } from "./character-selection/ClothingForm";

interface SelectionOption {
  value: string;
  label: string;
  labelComponent?: React.ReactNode;
}

interface CharacterSelectionScreenProps {
  title: string;
  options: SelectionOption[];
  characterId: string;
  onSelected: (value: string) => void;
  onBack?: () => void;
  updateField: string;
  nextStatus: CharacterStatus;
  showBackButton?: boolean;
}

export const CharacterSelectionScreen = ({
  title,
  options,
  characterId,
  onSelected,
  onBack,
  updateField,
  nextStatus,
  showBackButton = true,
}: CharacterSelectionScreenProps) => {
  if (updateField === 'clothing_type') {
    return (
      <ClothingForm
        title={title}
        options={options}
        characterId={characterId}
        onSelected={onSelected}
        onBack={onBack}
        showBackButton={showBackButton}
      />
    );
  }

  return (
    <SelectionForm
      title={title}
      options={options}
      characterId={characterId}
      onSelected={onSelected}
      onBack={onBack}
      updateField={updateField}
      nextStatus={nextStatus}
      showBackButton={showBackButton}
    />
  );
};