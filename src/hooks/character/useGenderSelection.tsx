import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface UseGenderSelectionProps {
  characterId: string;
  onGenderSelected: () => void;
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

      // First verify character ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, status')
        .eq('id', characterId)
        .single();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

      // Update gender and status in a single transaction
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          gender,
          status: 'race'
        })
        .eq('id', characterId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating gender:', updateError);
        throw updateError;
      }

      console.log('Gender selection saved successfully:', { characterId, gender });

      toast({
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Gender selected successfully</span>
          </div>
        ),
        duration: 2000,
      });
      
      // Call the callback to move to next step
      onGenderSelected();
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