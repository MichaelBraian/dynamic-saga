import { supabase } from "@/integrations/supabase/client";
import { useCharacterState } from "../useCharacterState";
import { useToast } from "@/hooks/use-toast";

export const useBasicCharacterHandlers = () => {
  const { updateCharacterState } = useCharacterState();
  const { toast } = useToast();

  const handleNameSelected = async (newCharacterId: string) => {
    console.log('Handling name selection with ID:', newCharacterId);
    updateCharacterState({
      characterId: newCharacterId,
      currentStep: "gender"
    });
  };

  const handleGenderSelected = async (characterId: string, isTransitioning: boolean) => {
    if (isTransitioning || !characterId) {
      console.log('Cannot handle gender selection: transitioning or no character ID');
      return;
    }
    
    try {
      console.log('Handling gender selection completion');
      
      const { error: updateError } = await supabase
        .from('characters')
        .update({ status: 'race' })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character status:', updateError);
        toast({
          variant: "destructive",
          description: "Failed to proceed to race selection. Please try again.",
        });
        throw updateError;
      }

      updateCharacterState({ 
        currentStep: "race"
      });

      toast({
        description: "Proceeding to race selection",
      });
    } catch (error) {
      console.error('Error handling gender selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed. Please try again.",
      });
    }
  };

  return {
    handleNameSelected,
    handleGenderSelected,
  };
};