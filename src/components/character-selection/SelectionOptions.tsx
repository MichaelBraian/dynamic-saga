import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SelectionOption {
  value: string;
  label: string;
  labelComponent?: React.ReactNode;
}

interface SelectionOptionsProps {
  options: SelectionOption[];
  onValueChange: (value: string) => void;
  isDisabled: boolean;
  initialValue?: string | null;
}

export const SelectionOptions = ({
  options,
  onValueChange,
  isDisabled,
  initialValue,
}: SelectionOptionsProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(initialValue || null);
  const selectedOptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValue) {
      setSelectedValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (selectedValue && selectedOptionRef.current) {
      // Wait for the animation to start
      setTimeout(() => {
        selectedOptionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [selectedValue]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleContinue = () => {
    if (selectedValue) {
      onValueChange(selectedValue);
    }
  };

  const glowStyles = "shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-white bg-white/20 backdrop-blur-sm";

  return (
    <div className="space-y-6">
      <RadioGroup
        onValueChange={handleValueChange}
        value={selectedValue || undefined}
        className="space-y-4"
      >
        {options.map((option) => (
          <div 
            key={option.value} 
            className="w-full"
            ref={selectedValue === option.value ? selectedOptionRef : null}
          >
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="peer sr-only"
              disabled={isDisabled}
            />
            <div className="flex items-center gap-4 group">
              <Label
                htmlFor={option.value}
                className={`flex-1 flex items-center justify-between rounded-lg border-2 border-white/20 bg-white/20 p-4 hover:bg-white/30 cursor-pointer text-2xl font-['Cinzel'] text-white transition-all duration-300 ease-in-out ${
                  selectedValue === option.value ? glowStyles : ''
                }`}
              >
                {option.labelComponent || option.label}
              </Label>
              {selectedValue === option.value && (
                <Button
                  onClick={handleContinue}
                  disabled={isDisabled}
                  className={`animate-fade-in h-full py-4 px-6 font-['Cinzel'] transition-all duration-300 text-white hover:bg-white/30 ${glowStyles}`}
                >
                  <ArrowRight className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};