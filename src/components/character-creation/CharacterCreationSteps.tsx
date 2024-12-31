import { CharacterStatus } from "@/types/character";
import { NameSelection } from "../NameSelection";
import { GenderSelection } from "../GenderSelection";
import { RaceSelection } from "../RaceSelection";
import { AnimalTypeSelection } from "../AnimalTypeSelection";
import { ClassSelection } from "../ClassSelection";
import { ClothingSelection } from "../ClothingSelection";
import { ArmorSelection } from "../ArmorSelection";

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
  switch (currentStep) {
    case "naming":
      return (
        <div className="animate-fade-in">
          <NameSelection onNameSelected={onNameSelected} />
        </div>
      );
    case "gender":
      return (
        <div className="animate-fade-in">
          <GenderSelection 
            characterId={characterId!} 
            onGenderSelected={onGenderSelected}
            onBack={onBack}
          />
        </div>
      );
    case "race":
      return (
        <div className="animate-fade-in">
          <RaceSelection 
            characterId={characterId!} 
            onRaceSelected={onRaceSelected}
            onBack={onBack}
          />
        </div>
      );
    case "animal_type":
      return (
        <div className="animate-fade-in">
          <AnimalTypeSelection 
            characterId={characterId!}
            onBack={onBack}
            onAnimalTypeSelected={onAnimalTypeSelected}
          />
        </div>
      );
    case "class":
      return (
        <div className="animate-fade-in">
          <ClassSelection 
            characterId={characterId!}
            onBack={onBack}
            onClassSelected={onClassSelected}
          />
        </div>
      );
    case "clothing":
      return (
        <div className="animate-fade-in">
          <ClothingSelection
            characterId={characterId!}
            characterClass={selectedClass!}
            onBack={onBack}
            onClothingSelected={onClothingSelected}
          />
        </div>
      );
    case "armor":
      return (
        <div className="animate-fade-in">
          <ArmorSelection
            characterId={characterId!}
            characterClass={selectedClass!}
            onBack={onBack}
          />
        </div>
      );
    default:
      return null;
  }
};