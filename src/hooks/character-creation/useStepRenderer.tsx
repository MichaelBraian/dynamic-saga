import { CharacterStatus } from "@/types/character";
import { useInitialStepsRenderer } from "./step-renderers/useInitialStepsRenderer";
import { useCharacterTypeStepsRenderer } from "./step-renderers/useCharacterTypeStepsRenderer";
import { useEquipmentStepsRenderer } from "./step-renderers/useEquipmentStepsRenderer";
import { useFinalStepsRenderer } from "./step-renderers/useFinalStepsRenderer";
import { useSpecialtyStepRenderer } from "./step-renderers/useSpecialtyStepRenderer";

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
  onArmorSelected: () => void;
  onMoralityCompleted: () => void;
  onAttributesCompleted: () => void;
  onSpecialtySelected: () => void;
  onBack: () => void;
}

export const useStepRenderer = (props: StepRendererProps) => {
  const { renderInitialSteps } = useInitialStepsRenderer({
    currentStep: props.currentStep,
    characterId: props.characterId,
    onNameSelected: props.onNameSelected,
    onGenderSelected: props.onGenderSelected,
    onRaceSelected: props.onRaceSelected,
    onBack: props.onBack,
  });

  const { renderCharacterTypeSteps } = useCharacterTypeStepsRenderer({
    currentStep: props.currentStep,
    characterId: props.characterId,
    onAnimalTypeSelected: props.onAnimalTypeSelected,
    onClassSelected: props.onClassSelected,
    onBack: props.onBack,
  });

  const { renderEquipmentSteps } = useEquipmentStepsRenderer({
    currentStep: props.currentStep,
    characterId: props.characterId,
    selectedClass: props.selectedClass,
    onClothingSelected: props.onClothingSelected,
    onArmorSelected: props.onArmorSelected,
    onBack: props.onBack,
  });

  const { renderFinalSteps } = useFinalStepsRenderer({
    currentStep: props.currentStep,
    characterId: props.characterId,
    onMoralityCompleted: props.onMoralityCompleted,
    onAttributesCompleted: props.onAttributesCompleted,
    onBack: props.onBack,
  });

  const { renderSpecialtyStep } = useSpecialtyStepRenderer({
    characterId: props.characterId,
    selectedClass: props.selectedClass,
    onSpecialtySelected: props.onSpecialtySelected,
    onBack: props.onBack,
  });

  return {
    renderInitialSteps,
    renderCharacterTypeSteps,
    renderEquipmentSteps,
    renderFinalSteps,
    renderSpecialtyStep,
  };
};