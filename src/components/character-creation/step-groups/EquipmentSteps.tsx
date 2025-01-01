import { ClothingStep } from "../steps/ClothingStep";
import { ArmorStep } from "../steps/ArmorStep";
import { CharacterStatus } from "@/types/character";

interface EquipmentStepsProps {
  currentStep: CharacterStatus;
  characterId: string;
  selectedClass: string | null;
  onClothingSelected: () => void;
  onArmorSelected: () => void;
  onBack: () => void;
}

export const EquipmentSteps = ({
  currentStep,
  characterId,
  selectedClass,
  onClothingSelected,
  onArmorSelected,
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
    case "armor":
      return (
        <ArmorStep
          characterId={characterId}
          selectedClass={selectedClass}
          onBack={onBack}
          onArmorSelected={onArmorSelected}
        />
      );
    default:
      return null;
  }
};