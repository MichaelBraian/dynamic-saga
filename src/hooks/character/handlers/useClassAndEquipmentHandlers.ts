import { supabase } from "@/integrations/supabase/client";
import { useCharacterState } from "../useCharacterState";
import { useToast } from "@/hooks/use-toast";

export const useClassAndEquipmentHandlers = () => {
  const { updateCharacterState } = useCharacterState();
  const { toast } = useToast();

  const handleClassSelected = async (characterClass: string, characterId: string, selectedRace: string) => {
    if (!characterId || !selectedRace) {
      console.error('Missing required data for class selection:', { characterId, selectedRace });
      toast({
        variant: "destructive",
        description: "Missing required information. Please try again.",
      });
      return;
    }
    
    try {
      console.log('Handling class selection:', { characterId, class: characterClass, race: selectedRace });
      
      const { error: updateError } = await supabase
        .from('characters')
        .update({ 
          class: characterClass,
          status: 'clothing'
        })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character class:', updateError);
        toast({
          variant: "destructive",
          description: "Failed to save class selection. Please try again.",
        });
        throw updateError;
      }

      updateCharacterState({
        currentStep: "clothing",
        selectedClass: characterClass
      });

      toast({
        description: "Class selected successfully. Proceeding to clothing selection.",
      });
    } catch (error) {
      console.error('Error handling class selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed. Please try again.",
      });
    }
  };

  const handleClothingSelected = async (characterId: string) => {
    if (!characterId) {
      console.error('No character ID provided for clothing selection');
      return;
    }

    try {
      console.log('Handling clothing selection completion:', { characterId });
      
      const { error: updateError } = await supabase
        .from('characters')
        .update({ status: 'armor' })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character status:', updateError);
        toast({
          variant: "destructive",
          description: "Failed to proceed to armor selection. Please try again.",
        });
        throw updateError;
      }

      updateCharacterState({ currentStep: "armor" });
      
      toast({
        description: "Clothing selected successfully. Proceeding to armor selection.",
      });
    } catch (error) {
      console.error('Error handling clothing selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed. Please try again.",
      });
    }
  };

  const handleArmorSelected = async (characterId: string) => {
    if (!characterId) {
      console.error('No character ID provided for armor selection');
      return;
    }

    try {
      console.log('Handling armor selection completion:', { characterId });
      
      const { error: updateError } = await supabase
        .from('characters')
        .update({ status: 'morality' })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character status:', updateError);
        toast({
          variant: "destructive",
          description: "Failed to proceed to morality questions. Please try again.",
        });
        throw updateError;
      }

      updateCharacterState({ currentStep: "morality" });
      
      toast({
        description: "Armor selected successfully. Proceeding to morality questions.",
      });
    } catch (error) {
      console.error('Error handling armor selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed. Please try again.",
      });
    }
  };

  return {
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected,
  };
};