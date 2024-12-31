import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { CharacterStatus } from "@/types/character";
import { SelectionHeader } from "./character-selection/SelectionHeader";
import { SelectionOptions } from "./character-selection/SelectionOptions";

interface SelectionOption {
  value: string;
  label: string;
  labelComponent?: React.ReactNode;
}

interface CharacterSelectionScreenProps {
  title: string;
  options: SelectionOption[];
  characterId: string;
  onSelected: (value: string) => void;
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
        className: "inline-flex h-8 items-center gap-2 rounded-md bg-background/60 px-3 backdrop-blur-sm",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">{`${updateField} updated`}</span>
          </div>
        ),
        duration: 2000,
      });

      onSelected(value);
    } catch (error) {
      console.error(`Error updating ${updateField}:`, error);
      toast({
        variant: "destructive",
        description: `Failed to save ${updateField} selection. Please try again.`,
        className: "inline-flex max-w-fit rounded-md bg-destructive px-3 py-2",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <SelectionHeader 
        title={title}
        onBack={onBack}
        showBackButton={showBackButton}
      />
      <SelectionOptions 
        options={options}
        onValueChange={handleSubmit}
        isDisabled={isSubmitting}
      />
    </div>
  );
};