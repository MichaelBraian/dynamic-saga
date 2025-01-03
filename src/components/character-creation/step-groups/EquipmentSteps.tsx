import { ClothingStep } from "../steps/ClothingStep";
import { CharacterStatus } from "@/types/character";

interface EquipmentStepsProps {
  currentStep: CharacterStatus;
  characterId: string;
  selectedClass: string | null;
  onClothingSelected: () => void;
  onBack: () => void;
}

export const EquipmentSteps = ({
  currentStep,
  characterId,
  selectedClass,
  onClothingSelected,
  onBack,
}: EquipmentStepsProps) => {
  if (!selectedClass) return null;

  switch (currentStep) {
    case "clothing":
      return (
        <ClothingStep
          characterId={characterId}
          selectedClass={selectedClass}
          onBack={onBack}
          onClothingSelected={onClothingSelected}
        />
      );
    default:
      return null;
  }
};