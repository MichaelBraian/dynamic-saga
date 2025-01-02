import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";

// Define valid attribute names as a constant to ensure consistency
const VALID_ATTRIBUTES = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as const;
type ValidAttributeName = typeof VALID_ATTRIBUTES[number];

// Display names mapping for UI
const DISPLAY_NAMES: Record<ValidAttributeName, string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma"
};

// Database codes mapping (three-letter codes for database)
const DB_CODES: Record<ValidAttributeName, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA"
};

type AttributeRolls = Partial<Record<ValidAttributeName, number>>;

function isValidAttributeName(name: string): name is ValidAttributeName {
  return VALID_ATTRIBUTES.includes(name.toLowerCase() as ValidAttributeName);
}

export const useAttributesManagement = (characterId: string, onComplete: () => void) => {
  const [attributeRolls, setAttributeRolls] = useState<AttributeRolls>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleRollComplete = (attributeName: string, value: number) => {
    if (!isValidAttributeName(attributeName)) {
      console.error(`Invalid attribute name: ${attributeName}`);
      return;
    }

    if (value < 2 || value > 12) {
      console.error(`Invalid attribute value: ${value}`);
      return;
    }

    const normalizedName = attributeName.toLowerCase() as ValidAttributeName;
    console.log(`Rolling complete for ${DISPLAY_NAMES[normalizedName]} with value ${value}`);
    setAttributeRolls(prev => ({
      ...prev,
      [normalizedName]: value
    }));
  };

  const areAllAttributesRolled = () => {
    return VALID_ATTRIBUTES.every(attr => {
      const value = attributeRolls[attr];
      return value !== undefined && value >= 2 && value <= 12;
    });
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
    console.log("Current attribute rolls:", attributeRolls);

    try {
      const attributeInserts = VALID_ATTRIBUTES.map(attr => ({
        character_id: characterId,
        attribute_name: DB_CODES[attr],
        value: attributeRolls[attr]!
      }));

      console.log("Sending to database:", JSON.stringify(attributeInserts, null, 2));

      const { error } = await supabase
        .from('character_attributes')
        .upsert(attributeInserts);

      if (error) {
        console.error("Database error details:", error);
        throw error;
      }

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