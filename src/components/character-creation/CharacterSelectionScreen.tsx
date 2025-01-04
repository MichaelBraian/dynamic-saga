import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SelectionOption {
  id: string;
  name: string;
  description?: string;
  modifiers?: string;
  labelComponent?: React.ReactNode;
}

interface CharacterSelectionScreenProps {
  title: string;
  options: SelectionOption[];
  selectedOption?: string;
  onOptionSelected: (optionId: string) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export function CharacterSelectionScreen({
  title,
  options,
  selectedOption,
  onOptionSelected,
  onBack,
  isSubmitting
}: CharacterSelectionScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-bold text-center flex-grow">{title}</h1>
        </div>

        <RadioGroup
          value={selectedOption}
          onValueChange={onOptionSelected}
          className="space-y-4"
        >
          {options.map((option) => (
            <div key={option.id} className="relative">
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="peer sr-only"
                disabled={isSubmitting}
              />
              <Label
                htmlFor={option.id}
                className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                {option.labelComponent || (
                  <>
                    <div className="font-semibold">{option.name}</div>
                    {option.description && (
                      <div className="text-sm text-gray-500">{option.description}</div>
                    )}
                    {option.modifiers && (
                      <div className="text-sm">{option.modifiers}</div>
                    )}
                  </>
                )}
                <div className="absolute right-4 top-4 opacity-0 peer-data-[state=checked]:opacity-100">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
} 