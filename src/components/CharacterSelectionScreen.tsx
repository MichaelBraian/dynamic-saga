import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CharacterStatus } from "@/types/character";

interface SelectionOption {
  value: string;
  label: string;
  labelComponent?: React.ReactNode;
}

interface CharacterSelectionScreenProps {
  title: string;
  options: SelectionOption[];
  characterId: string;
  onSelected: () => void;
  onBack?: () => void;
  updateField: string;
  nextStatus: CharacterStatus;
  showBackButton?: boolean;
}

export const CharacterSelectionScreen = ({
  title,
  options,
  characterId,
  onSelected,
  onBack,
  updateField,
  nextStatus,
  showBackButton = true,
}: CharacterSelectionScreenProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (value: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('characters')
        .update({ [updateField]: value, status: nextStatus })
        .eq('id', characterId);

      if (error) throw error;

      toast({
        description: `Character ${updateField} set to ${value}`,
      });

      onSelected();
    } catch (error) {
      console.error(`Error updating ${updateField}:`, error);
      toast({
        variant: "destructive",
        description: `Failed to save ${updateField} selection. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-8">
        {showBackButton && onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-3xl font-['Cinzel'] text-center flex-1 text-white">{title}</h1>
        {/* Empty div to maintain centering when back button is present */}
        {showBackButton && onBack && <div className="w-10" />}
      </div>
      
      <RadioGroup
        className="space-y-4"
        onValueChange={handleSubmit}
      >
        {options.map((option) => (
          <div key={option.value} className="w-full">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="peer sr-only"
              disabled={isSubmitting}
            />
            <Label
              htmlFor={option.value}
              className="flex w-full items-center justify-center rounded-lg border-2 border-white/20 bg-white/20 p-4 hover:bg-white/30 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/30 cursor-pointer text-2xl font-['Cinzel'] text-white"
            >
              {option.labelComponent || option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};