import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { validateClassSelection, getFallbackClass } from "@/utils/classValidation";
import { Race, Class } from "@/types/character";

export const useClassSelection = (
  characterId: string,
  onClassSelected: (characterClass: string) => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelected = async (value: string) => {
    if (!value) {
      toast({
        variant: "destructive",
        description: "Please select a class to continue",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Handling class selection:', { characterId, class: value });

      // Verify character ownership and get race
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, race')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Validate class selection based on race
      const validation = validateClassSelection(character.race as Race, value as Class);
      
      if (!validation.isValid) {
        const fallbackClass = getFallbackClass(character.race as Race);
        console.log('Using fallback class:', { fallbackClass, reason: validation.reason });
        
        toast({
          variant: "destructive",
          description: `${validation.reason}. Assigning ${fallbackClass} as a fallback class.`,
        });
        
        // Update with fallback class
        const { error: updateError } = await supabase
          .from('characters')
          .update({ 
            class: fallbackClass,
            status: 'clothing'
          })
          .eq('id', characterId);

        if (updateError) throw updateError;
        
        console.log('Fallback class saved successfully:', { characterId, class: fallbackClass });
        await onClassSelected(fallbackClass);
        return;
      }

      // Update with selected class
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          class: value,
          status: 'clothing'
        })
        .eq('id', characterId);

      if (updateError) throw updateError;

      console.log('Class selection saved successfully:', { characterId, class: value });
      await onClassSelected(value);
      showSuccessToast(toast, "Class selected successfully");
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