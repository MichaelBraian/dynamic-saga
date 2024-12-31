import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { InfoTooltip } from "./shared/InfoTooltip";

interface AnimalTypeSelectionProps {
  characterId: string;
  onBack: () => void;
  onAnimalTypeSelected: (animalType: string) => void;
}

const ANIMAL_TYPES = [
  { value: 'Lion', label: 'Lion', description: 'A majestic big cat known for its strength, leadership, and fierce loyalty to its pride.' },
  { value: 'Wolf', label: 'Wolf', description: 'A social predator that excels in pack tactics, known for its intelligence and endurance.' },
  { value: 'Snake', label: 'Snake', description: 'A stealthy reptile with lightning-fast reflexes and deadly precision.' },
  { value: 'Fox', label: 'Fox', description: 'A clever and adaptable creature known for its wit and agility.' },
  { value: 'Bear', label: 'Bear', description: 'A powerful omnivore combining immense strength with surprising intelligence.' },
];

export const AnimalTypeSelection = ({ characterId, onBack, onAnimalTypeSelected }: AnimalTypeSelectionProps) => {
  const { toast } = useToast();

  const handleSelected = (value: string) => {
    showSuccessToast(toast, "Animal type selected");
    onAnimalTypeSelected(value);
  };

  const animalTypesWithInfo = ANIMAL_TYPES.map(option => ({
    value: option.value,
    label: option.value,
    labelComponent: (
      <div className="flex items-center gap-2">
        {option.value}
        <InfoTooltip content={option.description} />
      </div>
    ),
  }));

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Animal Type"
        options={animalTypesWithInfo}
        characterId={characterId}
        onSelected={handleSelected}
        onBack={onBack}
        updateField="animal_type"
        nextStatus="class"
      />
    </div>
  );
};