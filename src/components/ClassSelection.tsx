import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { CLASS_OPTIONS } from "@/data/classOptions";

interface ClassSelectionProps {
  characterId: string;
  onBack: () => void;
  onClassSelected: (characterClass: string) => void;
}

export const ClassSelection = ({ characterId, onBack, onClassSelected }: ClassSelectionProps) => {
  const { toast } = useToast();

  const handleSelected = (value: string) => {
    showSuccessToast(toast, "Class selected");
    onClassSelected(value);
  };

  const classOptionsWithLabels = CLASS_OPTIONS.map(option => ({
    value: option.value,
    label: `${option.label}: ${option.description}`
  }));

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Class"
        options={classOptionsWithLabels}
        characterId={characterId}
        onSelected={handleSelected}
        onBack={onBack}
        updateField="class"
        nextStatus="clothing"
      />
    </div>
  );
};