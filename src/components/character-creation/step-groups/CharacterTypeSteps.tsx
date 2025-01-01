import { AnimalTypeStep } from "../steps/AnimalTypeStep";
import { ClassStep } from "../steps/ClassStep";
import { CharacterStatus } from "@/types/character";

interface CharacterTypeStepsProps {
  currentStep: CharacterStatus;
  characterId: string;
  onAnimalTypeSelected: (animalType: string) => void;
  onClassSelected: (characterClass: string) => void;
  onBack: () => void;
}

export const CharacterTypeSteps = ({
  currentStep,
  characterId,
  onAnimalTypeSelected,
  onClassSelected,
  onBack,
}: CharacterTypeStepsProps) => {
  switch (currentStep) {
    case "animal_type":
      return (
        <AnimalTypeStep 
          characterId={characterId}
          onBack={onBack}
          onAnimalTypeSelected={onAnimalTypeSelected}
        />
      );
    case "class":
      return (
        <ClassStep 
          characterId={characterId}
          onBack={onBack}
          onClassSelected={onClassSelected}
        />
      );
    default:
      return null;
  }
};