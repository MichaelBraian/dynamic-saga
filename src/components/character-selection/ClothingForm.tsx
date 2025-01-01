import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
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
}

export const ClothingForm = ({
  title,
  options,
  characterId,
  onSelected,
  onBack,
  showBackButton = true,
}: ClothingFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (value: string) => {
    setIsSubmitting(true);
    try {
      const { data: existingClothing, error: queryError } = await supabase
        .from('character_clothing')
        .select()
        .eq('character_id', characterId)
        .maybeSingle();

      if (queryError) throw queryError;

      let clothingError;
      if (existingClothing) {
        const { error } = await supabase
          .from('character_clothing')
          .update({ clothing_type: value })
          .eq('character_id', characterId);
        clothingError = error;
      } else {
        const { error } = await supabase
          .from('character_clothing')
          .insert({ character_id: characterId, clothing_type: value });
        clothingError = error;
      }

      if (clothingError) throw clothingError;

      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'armor' })
        .eq('id', characterId);

      if (statusError) throw statusError;

      toast({
        className: "inline-flex h-8 items-center gap-2 rounded-md bg-background/60 px-3 backdrop-blur-sm",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Clothing updated</span>
          </div>
        ),
        duration: 2000,
      });

      onSelected(value);
    } catch (error) {
      console.error('Error updating clothing:', error);
      toast({
        variant: "destructive",
        description: "Failed to save clothing selection. Please try again.",
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