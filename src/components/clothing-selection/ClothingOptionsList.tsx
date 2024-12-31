import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ClothingOption {
  value: string;
  label: string;
}

interface ClothingOptionsListProps {
  options: ClothingOption[];
  onValueChange: (value: string) => void;
  isDisabled: boolean;
}

export const ClothingOptionsList = ({ options, onValueChange, isDisabled }: ClothingOptionsListProps) => (
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
          <span>{option.label}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-white/80 hover:text-white" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] bg-black/90 text-white">
              <p>Clothing option for {option.label}</p>
            </TooltipContent>
          </Tooltip>
        </Label>
      </div>
    ))}
  </RadioGroup>
);