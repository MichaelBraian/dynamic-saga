import { Info } from "lucide-react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnimalTypeSelectionProps {
  characterId: string;
  onBack: () => void;
}

const ANIMAL_TYPES = [
  { value: 'Lion', label: 'Lion', description: 'A majestic big cat known for its strength, leadership, and fierce loyalty to its pride.' },
  { value: 'Wolf', label: 'Wolf', description: 'A social predator that excels in pack tactics, known for its intelligence and endurance.' },
  { value: 'Snake', label: 'Snake', description: 'A stealthy reptile with lightning-fast reflexes and deadly precision.' },
  { value: 'Fox', label: 'Fox', description: 'A clever and adaptable creature known for its wit and agility.' },
  { value: 'Bear', label: 'Bear', description: 'A powerful omnivore combining immense strength with surprising intelligence.' },
];

export const AnimalTypeSelection = ({ characterId, onBack }: AnimalTypeSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelected = () => {
    toast({
      className: "inline-flex h-8 items-center gap-2 rounded-md bg-background/60 px-3 backdrop-blur-sm",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">Animal type selected</span>
        </div>
      ),
      duration: 2000,
    });
    // Instead of navigating to home, we'll set the status to "class"
    // The parent component will handle showing the class selection screen
    navigate("/create-character");
  };

  const animalTypesWithInfo = ANIMAL_TYPES.map(option => ({
    ...option,
    labelComponent: (
      <div className="flex items-center gap-2">
        {option.label}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button type="button" className="cursor-help">
              <Info className="h-4 w-4 text-white/60 hover:text-white/80" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[300px] bg-black/90 text-white border-white/20">
            <p>{option.description}</p>
          </TooltipContent>
        </Tooltip>
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
        updateField="class"
        nextStatus="questioning"
      />
    </div>
  );
};