import { ClothingSelection } from "../../ClothingSelection";

interface ClothingStepProps {
  characterId: string;
  selectedClass: string;
  onBack: () => void;
  onClothingSelected: () => void;
}

export const ClothingStep = ({ characterId, selectedClass, onBack, onClothingSelected }: ClothingStepProps) => (
  <div className="animate-fade-in">
    <ClothingSelection
      characterId={characterId}
      characterClass={selectedClass}
      onBack={onBack}
      onClothingSelected={onClothingSelected}
    />
  </div>
);