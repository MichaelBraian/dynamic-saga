import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { showSuccessToast } from "@/utils/toast";

interface AttributeRoll {
  name: string;
  value: number | null;
}

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
      const { error } = await supabase
        .from('characters')
        .update({ status: 'morality' })
        .eq('id', characterId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating character status:', error);
      return false;
    }
  };

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      // Save all attributes
      const attributePromises = Object.entries(attributeRolls).map(([name, value]) => {
        if (value === undefined) return Promise.resolve();
        return supabase
          .from('character_attributes')
          .insert({
            character_id: characterId,
            attribute_name: name,
            value: value
          });
      });

      await Promise.all(attributePromises);

      // Update character status
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'specialty' })
        .eq('id', characterId);

      if (statusError) throw statusError;

      showSuccessToast(toast, "Attributes saved successfully");
      onComplete();
    } catch (error) {
      console.error('Error saving attributes:', error);
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