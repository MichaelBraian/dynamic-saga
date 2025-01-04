import { CharacterStatus } from "@/types/character";
import { useStepRenderer } from "@/hooks/character-creation/useStepRenderer";
import { CharacterCardStep } from "./steps/CharacterCardStep";

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
  onMoralityCompleted: () => void;
  onAttributesCompleted: () => void;
  onSpecialtySelected: () => void;
  onFaithPointsCompleted: () => void;
  onBack: () => void;
}

export const CharacterCreationSteps = ({
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
}: CharacterCreationStepsProps) => {
  console.log('Current step:', currentStep);
  console.log('Character ID:', characterId);
  console.log('Selected class:', selectedClass);

  const {
    renderInitialSteps,
    renderCharacterTypeSteps,
    renderEquipmentSteps,
    renderFinalSteps,
    renderSpecialtyStep,
    renderFaithPointsStep,
    renderCharacterCardStep,
  } = useStepRenderer({
    currentStep,
    characterId: characterId || "",
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
  });

  if (currentStep === "naming" || !characterId) {
    return renderInitialSteps();
  }

  const stepRenderers: Record<CharacterStatus, () => JSX.Element | null> = {
    naming: renderInitialSteps,
    gender: renderInitialSteps,
    race: renderInitialSteps,
    animal_type: renderCharacterTypeSteps,
    class: renderCharacterTypeSteps,
    clothing: renderEquipmentSteps,
    morality: renderFinalSteps,
    attributes: renderFinalSteps,
    specialty: renderSpecialtyStep,
    faith_points: renderFaithPointsStep,
    character_card: renderCharacterCardStep,
    questioning: () => null,
    generated: () => null,
    completed: () => null
  };

  const StepRenderer = stepRenderers[currentStep];
  if (!StepRenderer) {
    console.error('No component found for step:', currentStep);
    return null;
  }

  return StepRenderer();
}