import { CharacterStatus } from "@/types/character";
import { useCharacterSubscription } from "@/hooks/character/useCharacterSubscription";
import { StepRenderer } from "./StepRenderer";
import { LoadingState } from "./LoadingState";

interface CharacterCreationStepsProps {
  currentStep: CharacterStatus;
  characterId: string | null;
  selectedRace: string | null;
  selectedAnimalType: string | null;
  selectedClass: string | null;
  isTransitioning: boolean;
  onNameSelected: (newCharacterId: string) => void;
  onGenderSelected: () => void;
  onRaceSelected: () => Promise<void>;
  onAnimalTypeSelected: (animalType: string) => void;
  onClassSelected: (characterClass: string) => void;
  onClothingSelected: () => void;
  onArmorSelected: () => void;
  onBack: () => void;
}

export const CharacterCreationSteps = ({
  currentStep,
  characterId,
  selectedClass,
  isTransitioning,
  onNameSelected,
  onGenderSelected,
  onRaceSelected,
  onAnimalTypeSelected,
  onClassSelected,
  onClothingSelected,
  onArmorSelected,
  onBack,
}: CharacterCreationStepsProps) => {
  useCharacterSubscription(characterId, currentStep);

  if (isTransitioning) {
    return <LoadingState />;
  }

  return (
    <div className="animate-fade-in">
      <StepRenderer
        currentStep={currentStep}
        characterId={characterId}
        selectedClass={selectedClass}
        onNameSelected={onNameSelected}
        onGenderSelected={onGenderSelected}
        onRaceSelected={onRaceSelected}
        onAnimalTypeSelected={onAnimalTypeSelected}
        onClassSelected={onClassSelected}
        onClothingSelected={onClothingSelected}
        onArmorSelected={onArmorSelected}
        onBack={onBack}
      />
    </div>
  );
};