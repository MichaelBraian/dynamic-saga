import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";

export const useCharacterSelectionHandlers = () => {
  const { toast } = useToast();

  const verifyCharacter = async (characterId: string) => {
    const { data: character, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .maybeSingle();

    if (error) {
      console.error('Error verifying character:', error);
      throw new Error('Failed to verify character');
    }

    if (!character) {
      throw new Error('Character not found');
    }

    return character;
  };

  const updateCharacterStatus = async (characterId: string, status: CharacterStatus) => {
    const { error } = await supabase
      .from('characters')
      .update({ status })
      .eq('id', characterId);

    if (error) {
      console.error('Error updating character status:', error);
      throw new Error('Failed to update character status');
    }
  };

  const handleNameSelected = async (characterId: string) => {
    try {
      await verifyCharacter(characterId);
      await updateCharacterStatus(characterId, 'gender');
      toast({
        description: "Character created successfully",
      });
    } catch (error) {
      console.error('Error in name selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to create character",
      });
      throw error;
    }
  };

  const handleGenderSelected = async (characterId: string) => {
    try {
      await verifyCharacter(characterId);
      await updateCharacterStatus(characterId, 'race');
      toast({
        description: "Gender selected successfully",
      });
    } catch (error) {
      console.error('Error in gender selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save gender",
      });
      throw error;
    }
  };

  const handleRaceSelected = async (characterId: string) => {
    try {
      const character = await verifyCharacter(characterId);
      const nextStatus = character.race === 'Animal' ? 'animal_type' : 'class';
      await updateCharacterStatus(characterId, nextStatus);
      toast({
        description: "Race selected successfully",
      });
    } catch (error) {
      console.error('Error in race selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save race",
      });
      throw error;
    }
  };

  const handleAnimalTypeSelected = async (animalType: string, characterId: string) => {
    try {
      const character = await verifyCharacter(characterId);
      if (character.race !== 'Animal') {
        throw new Error('Animal type can only be selected for Animal race');
      }
      await updateCharacterStatus(characterId, 'class');
      toast({
        description: "Animal type selected successfully",
      });
    } catch (error) {
      console.error('Error in animal type selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save animal type",
      });
      throw error;
    }
  };

  const handleClassSelected = async (characterClass: string, characterId: string) => {
    try {
      const character = await verifyCharacter(characterId);
      await updateCharacterStatus(characterId, 'clothing');
      toast({
        description: "Class selected successfully",
      });
    } catch (error) {
      console.error('Error in class selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save class",
      });
      throw error;
    }
  };

  const handleClothingSelected = async (characterId: string) => {
    try {
      await verifyCharacter(characterId);
      await updateCharacterStatus(characterId, 'armor');
      toast({
        description: "Clothing selected successfully",
      });
    } catch (error) {
      console.error('Error in clothing selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save clothing",
      });
      throw error;
    }
  };

  const handleArmorSelected = async (characterId: string) => {
    try {
      await verifyCharacter(characterId);
      await updateCharacterStatus(characterId, 'morality');
      toast({
        description: "Armor selected successfully",
      });
    } catch (error) {
      console.error('Error in armor selection:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save armor",
      });
      throw error;
    }
  };

  return {
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected,
  };
};