import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SelectionOption {
  value: string;
  label: string;
  labelComponent?: React.ReactNode;
}

interface SelectionOptionsProps {
  options: SelectionOption[];
  onValueChange: (value: string) => void;
  isDisabled: boolean;
}

export const SelectionOptions = ({ options, onValueChange, isDisabled }: SelectionOptionsProps) => {
  return (
    <RadioGroup
      className="space-y-4"
      onValueChange={onValueChange}
    >
      {options.map((option) => (
        <div key={option.value} className="w-full">
          <RadioGroupItem
            value={option.value}
            id={option.value}
            className="peer sr-only"
            disabled={isDisabled}
          />
          <Label
            htmlFor={option.value}
            className="flex w-full items-center justify-between rounded-lg border-2 border-white/20 bg-white/20 p-4 hover:bg-white/30 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/30 cursor-pointer text-2xl font-['Cinzel'] text-white"
          >
            {option.labelComponent || option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};