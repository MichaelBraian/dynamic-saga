import { CharacterStatus } from "@/types/character";
import { CharacterTypeSteps } from "@/components/character-creation/step-groups/CharacterTypeSteps";

interface CharacterTypeStepsRendererProps {
  currentStep: CharacterStatus;
  characterId: string;
  onAnimalTypeSelected: (animalType: string) => void;
  onClassSelected: (characterClass: string) => void;
  onBack: () => void;
}

export const useCharacterTypeStepsRenderer = ({
  currentStep,
  characterId,
  onAnimalTypeSelected,
  onClassSelected,
  onBack,
}: CharacterTypeStepsRendererProps) => {
  const renderCharacterTypeSteps = () => (
    <CharacterTypeSteps
      currentStep={currentStep}
      characterId={characterId}
      onAnimalTypeSelected={onAnimalTypeSelected}
      onClassSelected={onClassSelected}
      onBack={onBack}
    />
  );

  return { renderCharacterTypeSteps };
};