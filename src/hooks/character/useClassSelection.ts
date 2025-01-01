import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CLASS_OPTIONS } from "@/data/classOptions";
import { validateClassSelection, getFallbackClass } from "@/utils/classValidation";
import { Race, Class } from "@/types/character";

export const useClassSelection = (
  characterId: string,
  onClassSelected: (characterClass: string) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateClass = (value: string): boolean => {
    return CLASS_OPTIONS.some(option => option.value === value);
  };

  const handleSelected = async (value: string) => {
    if (!value || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select a class to continue",
      });
      return;
    }

    if (!validateClass(value)) {
      toast({
        variant: "destructive",
        description: "Invalid class selected",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('id, race')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      const validation = validateClassSelection(character.race as Race, value as Class);
      
      if (!validation.isValid) {
        const fallbackClass = getFallbackClass(character.race as Race);
        console.log('Using fallback class:', { fallbackClass, reason: validation.reason });
        
        toast({
          variant: "destructive",
          description: `${validation.reason}. Assigning ${fallbackClass} as a fallback class.`,
        });
        
        const { error: updateError } = await supabase
          .from('characters')
          .update({ 
            class: fallbackClass,
            status: 'clothing'
          })
          .eq('id', characterId);

        if (updateError) throw updateError;
        
        onClassSelected(fallbackClass);
        return;
      }

      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          class: value,
          status: 'clothing'
        })
        .eq('id', characterId);

      if (updateError) throw updateError;

      toast({
        description: "Class selected successfully",
      });
      onClassSelected(value);
    } catch (error) {
      console.error('Error selecting class:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to select class. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSelected
  };
};