import { useState, useEffect } from "react";
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
  const [previousSelection, setPreviousSelection] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviousSelection = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('clothing_type')
        .eq('id', characterId)
        .single();

      if (!error && data?.clothing_type) {
        console.log('Previous clothing selection:', data.clothing_type);
        setPreviousSelection(data.clothing_type);
      }
    };

    fetchPreviousSelection();
  }, [characterId]);

  const handleSubmit = async (value: string) => {
    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          clothing_type: value,
          status: 'morality'
        })
        .eq('id', characterId);

      if (updateError) throw updateError;

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
        initialValue={previousSelection}
      />
    </div>
  );
};