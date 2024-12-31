import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { DiceRoll } from "@/components/shared/DiceRoll";
import { Sword, Move, Heart, Brain, Eye, User, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

  const attributes = [
    {
      name: "STR",
      label: "Strength",
      icon: <Sword className="h-5 w-5" />,
      description: "Determines physical power and melee combat effectiveness. Influences: Carrying capacity, damage dealt with heavy weapons, breaking objects.",
    },
    {
      name: "DEX",
      label: "Dexterity",
      icon: <Move className="h-5 w-5" />,
      description: "Reflects agility, speed, and precision. Influences: Dodging, accuracy with ranged weapons, stealth, and lock-picking.",
    },
    {
      name: "CON",
      label: "Constitution",
      icon: <Heart className="h-5 w-5" />,
      description: "Represents stamina, endurance, and overall health. Influences: Hit points (HP), resistance to fatigue or poison, physical durability.",
    },
    {
      name: "INT",
      label: "Intelligence",
      icon: <Brain className="h-5 w-5" />,
      description: "Measures reasoning, learning, and problem-solving skills. Influences: Spellcasting ability for certain classes, puzzle-solving, knowledge checks.",
    },
    {
      name: "WIS",
      label: "Wisdom",
      icon: <Eye className="h-5 w-5" />,
      description: "Reflects perception, insight, and spiritual connection. Influences: Resistance to mind-affecting spells, spotting hidden objects, intuition.",
    },
    {
      name: "CHA",
      label: "Charisma",
      icon: <User className="h-5 w-5" />,
      description: "Indicates personality, charm, and social influence. Influences: Persuasion, deception, leadership, and interactions with NPCs.",
    },
  ];

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
      
      // Save attributes to database
      const attributePromises = Object.entries(attributeRolls).map(([name, value]) => {
        return supabase
          .from('character_attributes')
          .insert({
            character_id: characterId,
            attribute_name: name,
            value: value
          });
      });

      const results = await Promise.all(attributePromises);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        console.error('Errors saving attributes:', errors);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save attributes. Please try again.",
        });
        return;
      }

      console.log('Attributes saved successfully, updating character status');

      // Update character status
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'completed' })
        .eq('id', characterId);

      if (statusError) {
        console.error('Error updating character status:', statusError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update character status. Please try again.",
        });
        return;
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
          <div key={attr.name} className="flex items-center gap-4 text-white p-4 rounded-lg bg-black/30">
            <div className="flex items-center gap-2 flex-1">
              {attr.icon}
              <span className="font-['Cinzel'] text-lg">{attr.label}</span>
              <span className="text-sm opacity-70">({attr.name})</span>
              <InfoTooltip content={attr.description} />
            </div>
            <div className="flex items-center gap-2">
              {attributeRolls[attr.name] === undefined && (
                <DiceRoll onRollComplete={(total) => handleRollComplete(attr.name, total)} />
              )}
              {attributeRolls[attr.name] !== undefined && (
                <span className="font-bold min-w-[2ch] text-center">{attributeRolls[attr.name]}</span>
              )}
            </div>
          </div>
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