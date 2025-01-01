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
  onBack,
}: CharacterCreationStepsProps) => {
  console.log('Current step:', currentStep);

  if (!characterId && currentStep !== "naming") {
    console.error('No character ID found');
    return null;
  }

  switch (currentStep) {
    case "naming":
      return <NameStep onNameSelected={onNameSelected} />;
    case "gender":
      return (
        <GenderStep 
          characterId={characterId!} 
          onGenderSelected={onGenderSelected}
          onBack={onBack}
        />
      );
    case "race":
      return (
        <RaceStep 
          characterId={characterId!} 
          onRaceSelected={onRaceSelected}
          onBack={onBack}
        />
      );
    case "animal_type":
      return (
        <AnimalTypeStep 
          characterId={characterId!}
          onBack={onBack}
          onAnimalTypeSelected={onAnimalTypeSelected}
        />
      );
    case "class":
      return (
        <ClassStep 
          characterId={characterId!}
          onBack={onBack}
          onClassSelected={onClassSelected}
        />
      );
    case "clothing":
      return (
        <ClothingStep
          characterId={characterId!}
          selectedClass={selectedClass!}
          onBack={onBack}
          onClothingSelected={onClothingSelected}
        />
      );
    case "armor":
      return (
        <ArmorStep
          characterId={characterId!}
          selectedClass={selectedClass!}
          onBack={onBack}
          onArmorSelected={onArmorSelected}
        />
      );
    case "morality":
      return (
        <MoralityStep
          characterId={characterId!}
          onBack={onBack}
        />
      );
    case "attributes":
      console.log('Rendering AttributesStep with characterId:', characterId);
      return (
        <AttributesStep
          characterId={characterId!}
          onBack={onBack}
        />
      );
    default:
      console.error('Unknown step:', currentStep);
      return null;
  }
};