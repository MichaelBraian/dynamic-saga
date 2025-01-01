import { CharacterStatus } from "@/types/character";
import { InitialSteps } from "./step-groups/InitialSteps";
import { CharacterTypeSteps } from "./step-groups/CharacterTypeSteps";
import { EquipmentSteps } from "./step-groups/EquipmentSteps";
import { FinalSteps } from "./step-groups/FinalSteps";
import { SpecialtyStep } from "./steps/SpecialtyStep";

interface CharacterCreationStepsProps {
  currentStep: CharacterStatus;
  characterId: string | null;
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

export const CharacterCreationSteps = ({
  currentStep,
  characterId,
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
}: CharacterCreationStepsProps) => {
  if (currentStep === "naming" || !characterId) {
    return (
      <InitialSteps
        currentStep={currentStep}
        characterId={characterId || ""}
        onNameSelected={onNameSelected}
        onGenderSelected={onGenderSelected}
        onRaceSelected={onRaceSelected}
        onBack={onBack}
      />
    );
  }

  const stepGroups = {
    gender: () => (
      <InitialSteps
        currentStep={currentStep}
        characterId={characterId}
        onNameSelected={onNameSelected}
        onGenderSelected={onGenderSelected}
        onRaceSelected={onRaceSelected}
        onBack={onBack}
      />
    ),
    race: () => (
      <InitialSteps
        currentStep={currentStep}
        characterId={characterId}
        onNameSelected={onNameSelected}
        onGenderSelected={onGenderSelected}
        onRaceSelected={onRaceSelected}
        onBack={onBack}
      />
    ),
    animal_type: () => (
      <CharacterTypeSteps
        currentStep={currentStep}
        characterId={characterId}
        onAnimalTypeSelected={onAnimalTypeSelected}
        onClassSelected={onClassSelected}
        onBack={onBack}
      />
    ),
    class: () => (
      <CharacterTypeSteps
        currentStep={currentStep}
        characterId={characterId}
        onAnimalTypeSelected={onAnimalTypeSelected}
        onClassSelected={onClassSelected}
        onBack={onBack}
      />
    ),
    clothing: () => (
      <EquipmentSteps
        currentStep={currentStep}
        characterId={characterId}
        selectedClass={selectedClass}
        onClothingSelected={onClothingSelected}
        onArmorSelected={onArmorSelected}
        onBack={onBack}
      />
    ),
    armor: () => (
      <EquipmentSteps
        currentStep={currentStep}
        characterId={characterId}
        selectedClass={selectedClass}
        onClothingSelected={onClothingSelected}
        onArmorSelected={onArmorSelected}
        onBack={onBack}
      />
    ),
    morality: () => (
      <FinalSteps
        currentStep={currentStep}
        characterId={characterId}
        onMoralityCompleted={onMoralityCompleted}
        onAttributesCompleted={onAttributesCompleted}
        onBack={onBack}
      />
    ),
    attributes: () => (
      <FinalSteps
        currentStep={currentStep}
        characterId={characterId}
        onMoralityCompleted={onMoralityCompleted}
        onAttributesCompleted={onAttributesCompleted}
        onBack={onBack}
      />
    ),
    specialty: () => (
      <SpecialtyStep
        characterId={characterId}
        characterClass={selectedClass || ''}
        onBack={onBack}
        onComplete={onSpecialtySelected}
      />
    ),
  };

  return stepGroups[currentStep as keyof typeof stepGroups]?.() || null;
};