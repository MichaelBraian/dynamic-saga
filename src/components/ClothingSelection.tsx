import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { CLOTHING_OPTIONS } from "@/data/clothingOptions";
import { InfoTooltip } from "./shared/InfoTooltip";

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
  const options = CLOTHING_OPTIONS[characterClass] || [];
  const optionsWithInfo = options.map(option => ({
    value: option.value,
    label: option.value,
    labelComponent: (
      <div className="flex items-center gap-2">
        {option.value}
        <InfoTooltip content={option.label} />
      </div>
    ),
  }));

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Clothing"
        options={optionsWithInfo}
        characterId={characterId}
        onSelected={onClothingSelected}
        onBack={onBack}
        updateField="clothing_type"
        nextStatus="morality"
      />
    </div>
  );
};