import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { Sword, Move, Heart, Brain, Eye, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AttributesStepProps {
  characterId: string;
  onBack: () => void;
}

export const AttributesStep = ({ characterId, onBack }: AttributesStepProps) => {
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
      const { error } = await supabase
        .from('characters')
        .update({ status: 'morality' })
        .eq('id', characterId);

      if (error) {
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
            <div className="flex items-center gap-2">
              {attr.icon}
              <span className="font-['Cinzel'] text-lg">{attr.label}</span>
              <span className="text-sm opacity-70">({attr.name})</span>
            </div>
            <InfoTooltip content={attr.description} />
          </div>
        ))}
      </div>
    </div>
  );
};