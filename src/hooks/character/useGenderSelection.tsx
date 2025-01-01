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

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('id')
        .eq('id', characterId)
        .maybeSingle();

      if (verifyError) {
        throw new Error("Failed to verify character");
      }

      if (!character) {
        throw new Error("Character not found");
      }

      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          gender,
          status: 'race'
        })
        .eq('id', characterId);

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