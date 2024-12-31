import { CharacterStatus } from "@/types/character";
import { NameSelection } from "../NameSelection";
import { GenderSelection } from "../character-selection/GenderSelection";
import { RaceSelection } from "../character-selection/RaceSelection";
import { AnimalTypeSelection } from "../character-selection/AnimalTypeSelection";
import { ClassSelection } from "../character-selection/ClassSelection";
import { ClothingSelection } from "../character-selection/ClothingSelection";
import { ArmorSelection } from "../character-selection/ArmorSelection";
import { MoralityContainer } from "../morality/MoralityContainer";

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
  onBack,
}: CharacterCreationStepsProps) => {
  const renderStep = () => {
    switch (currentStep) {
      case "naming":
        return <NameSelection onNameSelected={onNameSelected} />;
      case "gender":
        return (
          <GenderSelection 
            characterId={characterId!} 
            onGenderSelected={onGenderSelected}
            onBack={onBack}
          />
        );
      case "race":
        return (
          <RaceSelection 
            characterId={characterId!} 
            onRaceSelected={onRaceSelected}
            onBack={onBack}
          />
        );
      case "animal_type":
        return (
          <AnimalTypeSelection 
            characterId={characterId!}
            onBack={onBack}
            onAnimalTypeSelected={onAnimalTypeSelected}
          />
        );
      case "class":
        return (
          <ClassSelection 
            characterId={characterId!}
            onBack={onBack}
            onClassSelected={onClassSelected}
          />
        );
      case "clothing":
        return (
          <ClothingSelection
            characterId={characterId!}
            characterClass={selectedClass!}
            onBack={onBack}
            onClothingSelected={onClothingSelected}
          />
        );
      case "armor":
        return (
          <ArmorSelection
            characterId={characterId!}
            characterClass={selectedClass!}
            onBack={onBack}
          />
        );
      case "morality":
        return (
          <MoralityContainer
            characterId={characterId!}
            onBack={onBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {renderStep()}
    </div>
  );
};