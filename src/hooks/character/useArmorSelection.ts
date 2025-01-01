import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";

interface UseArmorSelectionProps {
  characterId: string;
  onArmorSelected?: () => void;
}

export const useArmorSelection = ({ characterId, onArmorSelected }: UseArmorSelectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleArmorSelected = async (value: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log('Selecting armor:', value, 'for character:', characterId);
    
    try {
      // Verify character exists and belongs to current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, class, status')
        .eq('id', characterId)
        .single();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Update armor selection
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          armor_type: value,
          status: 'morality'
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      console.log('Armor selection saved successfully');
      showSuccessToast(toast, "Armor selected successfully");
      
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