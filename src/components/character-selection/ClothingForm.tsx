import { SelectionHeader } from "./SelectionHeader";
import { SelectionOptions } from "./SelectionOptions";

interface ClothingFormProps {
  title: string;
  options: {
    value: string;
    label: string;
    labelComponent?: React.ReactNode;
  }[];
  characterId: string;
  onSelected: (value: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  isSubmitting?: boolean;
}

export const ClothingForm = ({
  title,
  options,
  onSelected,
  onBack,
  showBackButton = true,
  isSubmitting = false,
}: ClothingFormProps) => {
  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <SelectionHeader 
        title={title}
        onBack={onBack}
        showBackButton={showBackButton}
      />
      <SelectionOptions 
        options={options}
        onValueChange={onSelected}
        isDisabled={isSubmitting}
      />
    </div>
  );
};