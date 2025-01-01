import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseGenderSelectionProps {
  characterId: string;
  onGenderSelected?: () => void;
}

export const useGenderSelection = ({ 
  characterId, 
  onGenderSelected 
}: UseGenderSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleGenderSelected = async (gender: string) => {
    if (!gender || !characterId) {
      toast({
        variant: "destructive",
        description: "Please select a gender to continue",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Handling gender selection:', { characterId, gender });

      // Verify character ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Update gender
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          gender,
          status: 'race'
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      console.log('Gender selection saved successfully:', { characterId, gender });

      toast({
        description: "Gender selected successfully",
      });
      
      if (onGenderSelected) {
        onGenderSelected();
      }
    } catch (error) {
      console.error('Error updating gender:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Failed to save gender selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleGenderSelected
  };
};