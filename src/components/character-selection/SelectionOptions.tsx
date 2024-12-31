import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const getDisplayName = (label: string) => {
    // Extract the name part before the colon
    return label.split(':')[0];
  };

  const getDescription = (label: string) => {
    // Extract the description part after the colon
    const parts = label.split(':');
    return parts.length > 1 ? parts[1].trim() : '';
  };

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
            <span>{getDisplayName(option.label)}</span>
            {getDescription(option.label) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-white/80 hover:text-white" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] bg-black/90 text-white">
                  <p>{getDescription(option.label)}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};