import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { showSuccessToast } from "@/utils/toast";
import { updateCharacterStatus } from "@/utils/characterStatus";

export const useAttributesManagement = (characterId: string, onComplete: () => void) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [attributeRolls, setAttributeRolls] = useState<Record<string, number | undefined>>({
    strength: undefined,
    dexterity: undefined,
    constitution: undefined,
    intelligence: undefined,
    wisdom: undefined,
    charisma: undefined,
  });

  const handleRollComplete = (attributeName: string, value: number) => {
    setAttributeRolls(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  const allAttributesRolled = Object.values(attributeRolls).every(value => value !== undefined);

  const handleBack = async () => {
    try {
      await updateCharacterStatus(characterId, 'morality');
      return true;
    } catch (error) {
      console.error('Error updating character status:', error);
      return false;
    }
  };

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      console.log('Starting to save all attributes...');
      
      // Prepare all attributes for batch insert
      const attributesToSave = Object.entries(attributeRolls)
        .filter(([_, value]) => value !== undefined)
        .map(([name, value]) => ({
          character_id: characterId,
          attribute_name: name.toLowerCase(),
          value: value
        }));

      // Save all attributes in one operation
      const { error: saveError } = await supabase
        .from('character_attributes')
        .upsert(attributesToSave);

      if (saveError) {
        console.error('Error saving attributes:', saveError);
        throw saveError;
      }

      // Update character status to specialty
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'specialty' })
        .eq('id', characterId);

      if (statusError) {
        console.error('Error updating character status:', statusError);
        throw statusError;
      }

      console.log('Successfully saved all attributes and updated status');
      showSuccessToast(toast, "Attributes saved successfully");
      onComplete();
    } catch (error) {
      console.error('Error in save operation:', error);
      toast({
        variant: "destructive",
        description: "Failed to save attributes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    attributeRolls,
    isSaving,
    allAttributesRolled,
    handleRollComplete,
    handleBack,
    handleContinue
  };
};