import { CharacterStatus } from "@/types/character";
import { NameStep } from "./steps/NameStep";
import { GenderStep } from "./steps/GenderStep";
import { RaceStep } from "./steps/RaceStep";
import { AnimalTypeStep } from "./steps/AnimalTypeStep";
import { ClassStep } from "./steps/ClassStep";
import { ClothingStep } from "./steps/ClothingStep";
import { ArmorStep } from "./steps/ArmorStep";
import { MoralityStep } from "./steps/MoralityStep";
import { AttributesStep } from "./steps/AttributesStep";

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
  onArmorSelected,
  onMoralityCompleted,
  onBack,
}: CharacterCreationStepsProps) => {
  // Handle naming step separately since it doesn't require characterId
  if (currentStep === "naming") {
    return <NameStep onNameSelected={onNameSelected} />;
  }

  // Early return if no characterId for steps that require it
  if (!characterId) {
    return null;
  }

  switch (currentStep) {
    case "gender":
      return (
        <GenderStep 
          characterId={characterId} 
          onGenderSelected={onGenderSelected}
          onBack={onBack}
        />
      );
    case "race":
      return (
        <RaceStep 
          characterId={characterId} 
          onRaceSelected={onRaceSelected}
          onBack={onBack}
        />
      );
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
    case "clothing":
      return selectedClass ? (
        <ClothingStep
          characterId={characterId}
          selectedClass={selectedClass}
          onBack={onBack}
          onClothingSelected={onClothingSelected}
        />
      ) : null;
    case "armor":
      return selectedClass ? (
        <ArmorStep
          characterId={characterId}
          selectedClass={selectedClass}
          onBack={onBack}
          onArmorSelected={onArmorSelected}
        />
      ) : null;
    case "morality":
      return (
        <MoralityStep
          characterId={characterId}
          onBack={onBack}
          onComplete={onMoralityCompleted}
        />
      );
    case "attributes":
      return (
        <AttributesStep
          characterId={characterId}
          onBack={onBack}
        />
      );
    default:
      return null;
  }
};