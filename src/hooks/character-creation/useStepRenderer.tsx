import { CharacterStatus } from "@/types/character";
import { useInitialStepsRenderer } from "./step-renderers/useInitialStepsRenderer";
import { useCharacterTypeStepsRenderer } from "./step-renderers/useCharacterTypeStepsRenderer";
import { useEquipmentStepsRenderer } from "./step-renderers/useEquipmentStepsRenderer";
import { useFinalStepsRenderer } from "./step-renderers/useFinalStepsRenderer";
import { useSpecialtyStepRenderer } from "./step-renderers/useSpecialtyStepRenderer";
import { useFaithPointsStepRenderer } from "./step-renderers/useFaithPointsStepRenderer";
import { FaithPointsStep } from "@/components/character-creation/steps/FaithPointsStep";
import { CharacterCardStep } from "@/components/character-creation/steps/CharacterCardStep";
import { updateCharacterStatus } from "@/utils/characterStatus";

interface StepRendererProps {
  currentStep: CharacterStatus;
  characterId: string;
  selectedRace: string | null;
  selectedAnimalType: string | null;
  selectedClass: string | null;
  onNameSelected: (newCharacterId: string) => void;
  onGenderSelected: () => void;
  onRaceSelected: () => Promise<void>;
  onAnimalTypeSelected: (animalType: string) => void;
  onClassSelected: (characterClass: string) => void;
  onClothingSelected: () => void;
  onMoralityCompleted: () => void;
  onAttributesCompleted: () => void;
  onSpecialtySelected: () => void;
  onFaithPointsCompleted: () => void;
  onBack: () => void;
}

export const useStepRenderer = ({
  currentStep,
  characterId,
  selectedRace,
  selectedAnimalType,
  selectedClass,
  onNameSelected,
  onGenderSelected,
  onRaceSelected,
  onAnimalTypeSelected,
  onClassSelected,
  onClothingSelected,
  onMoralityCompleted,
  onAttributesCompleted,
  onSpecialtySelected,
  onFaithPointsCompleted,
  onBack,
}: StepRendererProps) => {
  const { renderInitialSteps } = useInitialStepsRenderer({
    currentStep: currentStep,
    characterId: characterId,
    onNameSelected: onNameSelected,
    onGenderSelected: onGenderSelected,
    onRaceSelected: onRaceSelected,
    onBack: onBack,
  });

  const { renderCharacterTypeSteps } = useCharacterTypeStepsRenderer({
    currentStep: currentStep,
    characterId: characterId,
    onAnimalTypeSelected: onAnimalTypeSelected,
    onClassSelected: onClassSelected,
    onBack: onBack,
  });

  const { renderEquipmentSteps } = useEquipmentStepsRenderer({
    currentStep,
    characterId,
    selectedClass,
    onClothingSelected,
    onBack,
    onArmorSelected: () => {},
  });

  const { renderFinalSteps } = useFinalStepsRenderer({
    currentStep: currentStep,
    characterId: characterId,
    onMoralityCompleted: onMoralityCompleted,
    onAttributesCompleted: onAttributesCompleted,
    onBack: onBack,
  });

  const { renderSpecialtyStep } = useSpecialtyStepRenderer({
    characterId: characterId,
    selectedClass: selectedClass,
    onSpecialtySelected: onSpecialtySelected,
    onBack: onBack,
  });

  const renderFaithPointsStep = () => {
    return (
      <FaithPointsStep
        characterId={characterId}
        onBack={onBack}
        onComplete={async () => {
          await updateCharacterStatus(characterId, 'character_card');
          onFaithPointsCompleted();
        }}
      />
    );
  };

  const renderCharacterCardStep = () => {
    return (
      <CharacterCardStep
        characterId={characterId}
      />
    );
  };

  return {
    renderInitialSteps,
    renderCharacterTypeSteps,
    renderEquipmentSteps,
    renderFinalSteps,
    renderSpecialtyStep,
    renderFaithPointsStep,
    renderCharacterCardStep,
  };
};