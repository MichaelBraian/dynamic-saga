import { CharacterStatus } from "@/types/character";
import { EquipmentSteps } from "@/components/character-creation/step-groups/EquipmentSteps";

interface EquipmentStepsRendererProps {
  currentStep: CharacterStatus;
  characterId: string;
  selectedClass: string | null;
  onClothingSelected: () => void;
  onArmorSelected: () => void;
  onBack: () => void;
}

export const useEquipmentStepsRenderer = ({
  currentStep,
  characterId,
  selectedClass,
  onClothingSelected,
  onArmorSelected,
  onBack,
}: EquipmentStepsRendererProps) => {
  const renderEquipmentSteps = () => (
    <EquipmentSteps
      currentStep={currentStep}
      characterId={characterId}
      selectedClass={selectedClass}
      onClothingSelected={onClothingSelected}
      onArmorSelected={onArmorSelected}
      onBack={onBack}
    />
  );

  return { renderEquipmentSteps };
};