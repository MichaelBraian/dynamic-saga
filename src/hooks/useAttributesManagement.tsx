import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";

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

interface AttributeRecord {
  attribute_name: string;
  value: number;
}

function isValidAttributeName(name: string): name is ValidAttributeName {
  return VALID_ATTRIBUTES.includes(name.toLowerCase() as ValidAttributeName);
}

export const useAttributesManagement = (characterId: string, onComplete: () => void) => {
  const [attributeRolls, setAttributeRolls] = useState<AttributeRolls>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch existing attributes
  const { data: existingAttributes, isLoading } = useQuery({
    queryKey: ['character-attributes', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_attributes')
        .select('attribute_name, value')
        .eq('character_id', characterId);
      
      if (error) throw error;
      
      // Convert DB codes back to attribute names and update state
      const attributeValues = (data as AttributeRecord[] || []).reduce((acc, curr) => {
        const attrName = Object.entries(DB_CODES).find(([_, code]) => code === curr.attribute_name)?.[0];
        if (attrName) {
          acc[attrName as ValidAttributeName] = curr.value;
        }
        return acc;
      }, {} as AttributeRolls);

      return attributeValues;
    }
  });

  // Update local state when existing attributes are fetched
  useEffect(() => {
    if (existingAttributes) {
      setAttributeRolls(existingAttributes);
    }
  }, [existingAttributes]);

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
    
    // Don't allow re-rolling if value already exists
    if (attributeRolls[normalizedName] !== undefined) {
      console.log(`Attribute ${normalizedName} already has a value`);
      return;
    }

    console.log(`Rolling complete for ${DISPLAY_NAMES[normalizedName]} with value ${value}`);
    setAttributeRolls(prev => ({
      ...prev,
      [normalizedName]: value
    }));

    // Save the individual roll immediately
    saveAttributeValue(normalizedName, value);
  };

  const saveAttributeValue = async (attributeName: ValidAttributeName, value: number) => {
    try {
      const { error } = await supabase
        .from('character_attributes')
        .upsert({
          character_id: characterId,
          attribute_name: DB_CODES[attributeName],
          base_value: value,
          modifier: 0
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving attribute:", error);
      toast({
        variant: "destructive",
        description: "Failed to save attribute. Please try again.",
      });
    }
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
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'specialty' })
        .eq('id', characterId);

      if (statusError) throw statusError;

      showSuccessToast(toast, "Attributes saved successfully");
      onComplete();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        description: "Failed to update status. Please try again.",
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