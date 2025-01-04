import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { CharacterStatus } from "@/types/character";
import { SelectionHeader } from "./SelectionHeader";
import { SelectionOptions } from "./SelectionOptions";

interface SelectionFormProps {
  title: string;
  options: {
    value: string;
    label: string;
    labelComponent?: React.ReactNode;
  }[];
  characterId: string;
  onSelected: (value: string) => void;
  onBack?: () => void;
  updateField: string;
  nextStatus: CharacterStatus;
  showBackButton?: boolean;
}

export const SelectionForm = ({
  title,
  options,
  characterId,
  onSelected,
  onBack,
  updateField,
  nextStatus,
  showBackButton = true,
}: SelectionFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentValue, setCurrentValue] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentValue = async () => {
      if (updateField === 'specialty') {
        const { data, error } = await supabase
          .from('character_specialties')
          .select('specialty_id')
          .eq('character_id', characterId)
          .single();

        if (!error && data) {
          setCurrentValue(data.specialty_id);
        }
      } else {
        const { data, error } = await supabase
          .from('characters')
          .select(updateField)
          .eq('id', characterId)
          .single();

        if (!error && data) {
          setCurrentValue(data[updateField]);
        }
      }
    };

    fetchCurrentValue();
  }, [characterId, updateField]);

  const handleSubmit = async (value: string) => {
    setIsSubmitting(true);
    try {
      if (updateField === 'specialty') {
        const { error } = await supabase.rpc('handle_specialty_selection', {
          p_character_id: characterId,
          p_specialty_id: value
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('characters')
          .update({ 
            [updateField]: value,
            status: nextStatus 
          })
          .eq('id', characterId);
        if (error) throw error;
      }

      toast({
        className: "inline-flex h-8 items-center gap-2 rounded-md bg-background/60 px-3 backdrop-blur-sm",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Selection saved</span>
          </div>
        ),
        duration: 2000,
      });

      onSelected(value);
    } catch (error) {
      console.error('Error updating selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save selection. Please try again.",
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
        initialValue={currentValue || undefined}
      />
    </div>
  );
};