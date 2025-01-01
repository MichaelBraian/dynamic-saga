import { supabase } from "@/integrations/supabase/client";
import { useCharacterState } from "../useCharacterState";
import { useToast } from "@/hooks/use-toast";

export const useRaceAndTypeHandlers = () => {
  const { updateCharacterState } = useCharacterState();
  const { toast } = useToast();

  const handleRaceSelected = async (characterId: string) => {
    if (!characterId) {
      console.error('No character ID provided for race selection');
      return;
    }

    try {
      console.log('Handling race selection completion');
      
      const { data: character, error: fetchError } = await supabase
        .from('characters')
        .select('race')
        .eq('id', characterId)
        .single();

      if (fetchError) throw fetchError;

      const nextStatus = character?.race === 'Animal' ? 'animal_type' : 'class';

      const { error: updateError } = await supabase
        .from('characters')
        .update({ status: nextStatus })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character status:', updateError);
        toast({
          variant: "destructive",
          description: "Failed to proceed to next step. Please try again.",
        });
        throw updateError;
      }

      updateCharacterState({
        currentStep: nextStatus
      });

      toast({
        description: `Proceeding to ${nextStatus === 'animal_type' ? 'animal type' : 'class'} selection`,
      });
    } catch (error) {
      console.error('Error handling race selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed. Please try again.",
      });
    }
  };

  const handleAnimalTypeSelected = async (animalType: string, characterId: string) => {
    if (!characterId) {
      console.error('No character ID provided for animal type selection');
      return;
    }

    try {
      console.log('Handling animal type selection:', { characterId, animalType });

      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          status: 'class',
          animal_type: animalType 
        })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character status:', updateError);
        toast({
          variant: "destructive",
          description: "Failed to save animal type selection. Please try again.",
        });
        throw updateError;
      }

      updateCharacterState({
        currentStep: "class",
        selectedAnimalType: animalType
      });

      toast({
        description: "Animal type selected successfully. Proceeding to class selection.",
      });
    } catch (error) {
      console.error('Error handling animal type selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed. Please try again.",
      });
    }
  };

  return {
    handleRaceSelected,
    handleAnimalTypeSelected,
  };
};