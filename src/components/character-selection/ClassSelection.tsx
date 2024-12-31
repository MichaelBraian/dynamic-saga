import { BaseSelectionForm } from "./shared/BaseSelectionForm";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { CLASS_OPTIONS } from "@/data/classOptions";
import { InfoTooltip } from "../shared/InfoTooltip";

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

  const classOptionsWithInfo = CLASS_OPTIONS.map(option => ({
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
      <BaseSelectionForm
        title="Choose Class"
        options={classOptionsWithInfo}
        characterId={characterId}
        onSelected={handleSelected}
        onBack={onBack}
        updateField="class"
        nextStatus="clothing"
      />
    </div>
  );
};