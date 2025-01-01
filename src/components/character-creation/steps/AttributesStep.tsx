import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AttributeItem } from "./attributes/AttributeItem";
import { attributes } from "./attributes/attributeDefinitions";

interface AttributesStepProps {
  characterId: string;
  onBack: () => void;
}

interface AttributeRolls {
  [key: string]: number | null;
}

export const AttributesStep = ({ characterId, onBack }: AttributesStepProps) => {
  const [attributeRolls, setAttributeRolls] = useState<AttributeRolls>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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
        return;
      }

      onBack();
    } catch (error) {
      console.error('Error in handleBack:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleRollComplete = (attributeName: string, total: number) => {
    console.log('Roll completed for:', attributeName, 'with total:', total);
    setAttributeRolls(prev => ({
      ...prev,
      [attributeName]: total
    }));
  };

  const handleContinue = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      console.log('Saving attributes:', attributeRolls);
      
      // Save each attribute one at a time
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

    } catch (error) {
      console.error('Error in handleContinue:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const allAttributesRolled = attributes.every(attr => attributeRolls[attr.name] !== undefined);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-white hover:bg-white/20 mr-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-['Cinzel'] text-white">Character Attributes</h2>
      </div>

      <div className="space-y-4">
        {attributes.map((attr) => (
          <AttributeItem
            key={attr.name}
            icon={attr.icon}
            label={attr.label}
            name={attr.name}
            description={attr.description}
            value={attributeRolls[attr.name] ?? undefined}
            onRollComplete={(total) => handleRollComplete(attr.name, total)}
          />
        ))}
      </div>

      {allAttributesRolled && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleContinue}
            disabled={isSaving}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            {isSaving ? 'Saving...' : 'Continue'} <ArrowRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};