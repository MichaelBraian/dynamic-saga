import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { attributes } from "@/components/character-creation/steps/attributes/attributeDefinitions";

export const useAttributesManagement = (characterId: string) => {
  const [attributeRolls, setAttributeRolls] = useState<Record<string, number | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleRollComplete = (attributeName: string, total: number) => {
    console.log('Roll completed for:', attributeName, 'with total:', total);
    setAttributeRolls(prev => ({
      ...prev,
      [attributeName]: total
    }));
  };

  const handleBack = async () => {
    try {
      console.log('Going back to morality step');
      const { error } = await supabase
        .from('characters')
        .update({ status: 'morality' })
        .eq('id', characterId);

      if (error) {
        console.error('Error updating character status:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to go back. Please try again.",
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in handleBack:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    }
  };

  const handleContinue = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      console.log('Saving attributes:', attributeRolls);
      
      for (const [name, value] of Object.entries(attributeRolls)) {
        if (value === null) continue;
        
        const { error } = await supabase
          .from('character_attributes')
          .insert({
            character_id: characterId,
            attribute_name: name,
            value: value
          });

        if (error) {
          console.error(`Error saving attribute ${name}:`, error);
          throw error;
        }
      }

      console.log('Attributes saved successfully, updating character status');

      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'completed' })
        .eq('id', characterId);

      if (statusError) {
        console.error('Error updating character status:', statusError);
        throw statusError;
      }

      toast({
        title: "Success",
        description: "Character attributes saved successfully!",
      });

      return true;
    } catch (error) {
      console.error('Error in handleContinue:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const allAttributesRolled = attributes.every(attr => attributeRolls[attr.name] !== undefined);

  return {
    attributeRolls,
    isSaving,
    allAttributesRolled,
    handleRollComplete,
    handleBack,
    handleContinue
  };
};