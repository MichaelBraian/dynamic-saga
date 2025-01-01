import { CharacterStatus } from "@/types/character";
import { InitialSteps } from "@/components/character-creation/step-groups/InitialSteps";
import { CharacterTypeSteps } from "@/components/character-creation/step-groups/CharacterTypeSteps";
import { EquipmentSteps } from "@/components/character-creation/step-groups/EquipmentSteps";
import { FinalSteps } from "@/components/character-creation/step-groups/FinalSteps";
import { SpecialtyStep } from "@/components/character-creation/steps/SpecialtyStep";

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
  onArmorSelected,
  onMoralityCompleted,
  onAttributesCompleted,
  onSpecialtySelected,
  onBack,
}: StepRendererProps) => {
  const renderInitialSteps = () => (
    <InitialSteps
      currentStep={currentStep}
      characterId={characterId}
      onNameSelected={onNameSelected}
      onGenderSelected={onGenderSelected}
      onRaceSelected={onRaceSelected}
      onBack={onBack}
    />
  );

  const renderCharacterTypeSteps = () => (
    <CharacterTypeSteps
      currentStep={currentStep}
      characterId={characterId}
      onAnimalTypeSelected={onAnimalTypeSelected}
      onClassSelected={onClassSelected}
      onBack={onBack}
    />
  );

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

  const renderFinalSteps = () => (
    <FinalSteps
      currentStep={currentStep}
      characterId={characterId}
      onMoralityCompleted={onMoralityCompleted}
      onAttributesCompleted={onAttributesCompleted}
      onBack={onBack}
    />
  );

  const renderSpecialtyStep = () => (
    <SpecialtyStep
      characterId={characterId}
      characterClass={selectedClass || ''}
      onBack={onBack}
      onComplete={onSpecialtySelected}
    />
  );

  return {
    renderInitialSteps,
    renderCharacterTypeSteps,
    renderEquipmentSteps,
    renderFinalSteps,
    renderSpecialtyStep,
  };
};