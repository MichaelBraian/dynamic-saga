import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseArmorSelectionProps {
  characterId: string;
  onArmorSelected?: () => void;
}

export const useArmorSelection = ({ characterId, onArmorSelected }: UseArmorSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleArmorSelected = async (value: string) => {
    if (!value || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select armor to continue",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Selecting armor:', value, 'for character:', characterId);
    
    try {
      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('id, class')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          armor_type: value,
          status: 'morality'
        })
        .eq('id', characterId);

      if (updateError) throw updateError;

      console.log('Armor selection saved successfully');
      
      toast({
        description: "Armor selected successfully",
      });
      
      if (onArmorSelected) {
        onArmorSelected();
      }
    } catch (error) {
      console.error('Error saving armor selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to save armor selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleArmorSelected
  };
};