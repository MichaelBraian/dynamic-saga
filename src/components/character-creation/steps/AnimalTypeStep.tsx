import { AnimalTypeSelection } from "../../AnimalTypeSelection";

interface AnimalTypeStepProps {
  characterId: string;
  onBack: () => void;
  onAnimalTypeSelected: (animalType: string) => void;
}

export const AnimalTypeStep = ({ characterId, onBack, onAnimalTypeSelected }: AnimalTypeStepProps) => (
  <div className="animate-fade-in">
    <AnimalTypeSelection 
      characterId={characterId}
      onBack={onBack}
      onAnimalTypeSelected={onAnimalTypeSelected}
    />
  </div>
);