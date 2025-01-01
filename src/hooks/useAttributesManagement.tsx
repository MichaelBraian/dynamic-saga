import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";

interface AttributeRolls {
  [key: string]: number | undefined;
}

export const useAttributesManagement = (characterId: string, onComplete: () => void) => {
  const [attributeRolls, setAttributeRolls] = useState<AttributeRolls>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleRollComplete = (attributeName: string, value: number) => {
    setAttributeRolls(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  const areAllAttributesRolled = () => {
    const requiredAttributes = [
      "strength",
      "dexterity",
      "constitution",
      "intelligence",
      "wisdom",
      "charisma"
    ];
    return requiredAttributes.every(attr => attributeRolls[attr] !== undefined);
  };

  const handleContinue = async () => {
    if (!areAllAttributesRolled()) {
      toast({
        variant: "destructive",
        description: "Please roll all attributes before continuing.",
      });
      return;
    }

    setIsSaving(true);
    console.log("Starting to save all attributes...");

    try {
      const attributeInserts = Object.entries(attributeRolls).map(([attribute_name, value]) => ({
        character_id: characterId,
        attribute_name,
        value
      }));

      const { error } = await supabase
        .from('character_attributes')
        .upsert(attributeInserts);

      if (error) throw error;

      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'specialty' })
        .eq('id', characterId);

      if (statusError) throw statusError;

      showSuccessToast(toast, "Attributes saved successfully");
      onComplete();
    } catch (error) {
      console.error("Error saving attributes:", error);
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
    handleRollComplete,
    handleContinue,
    isSaving,
    areAllAttributesRolled
  };
};