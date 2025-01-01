import { CharacterStatus } from "@/types/character";
import { useCharacterSubscription } from "@/hooks/character/useCharacterSubscription";
import { StepRenderer } from "./StepRenderer";
import { LoadingState } from "./LoadingState";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { useEffect } from "react";

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
  selectedRace,
  selectedAnimalType,
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

  useEffect(() => {
    console.log('CharacterCreationSteps - State Update:', {
      currentStep,
      characterId,
      selectedRace,
      selectedAnimalType,
      selectedClass,
      isTransitioning,
    });
  }, [currentStep, characterId, selectedRace, selectedAnimalType, selectedClass, isTransitioning]);

  if (!currentStep) {
    console.error('No current step provided');
    return <LoadingState message="Initializing character creation..." />;
  }

  if (isTransitioning) {
    console.log('CharacterCreationSteps - Transitioning to:', currentStep);
    return <LoadingState message={`Transitioning to ${currentStep} step...`} />;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};