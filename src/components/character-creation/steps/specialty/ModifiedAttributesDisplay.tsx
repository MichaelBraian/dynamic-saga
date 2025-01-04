import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { attributes } from "../attributes/attributeDefinitions";

interface CharacterAttribute {
  character_id: string;
  attribute_name: string;
  value: number;
}

export interface ModifiedAttributesDisplayProps {
  characterId: string;
  modifiers: Record<string, number>;
  onConfirm: () => void;
  onBack: () => void;
}

export const ModifiedAttributesDisplay = ({
  characterId,
  modifiers,
  onConfirm,
  onBack,
}: ModifiedAttributesDisplayProps) => {
  const { data: currentAttributes } = useQuery({
    queryKey: ['character-attributes', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_attributes')
        .select('attribute_name, value')
        .eq('character_id', characterId);

      if (error) throw error;
      return (data as unknown as CharacterAttribute[]).reduce((acc, curr) => ({
        ...acc,
        [curr.attribute_name]: curr.value
      }), {} as Record<string, number>);
    },
  });

  if (!currentAttributes) return null;

  const getModifiedValue = (attr: string) => {
    const currentValue = currentAttributes[attr] || 0;
    const modifier = modifiers[attr] || 0;
    return currentValue + modifier;
  };

  const formatAttributeChange = (attr: string) => {
    const currentValue = currentAttributes[attr] || 0;
    const modifier = modifiers[attr] || 0;
    const finalValue = getModifiedValue(attr);
    const attribute = attributes.find(a => a.name === attr);
    if (!attribute) return null;
    const Icon = attribute.icon;
    
    return (
      <div key={attr} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-5 flex-shrink-0">
            <Icon className="h-5 w-5 text-white/80" />
          </div>
          <span className="text-white/60 text-sm w-8">{attr}</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{currentValue}</span>
            {modifier !== 0 && (
              <span className={`text-lg ${modifier > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {modifier > 0 ? '+' : ''}{modifier}
              </span>
            )}
            <span className="text-white/50">=</span>
            <span className="text-2xl font-bold text-white">{finalValue}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex items-center mb-6 relative z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 mr-2 relative z-50"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-['Cinzel'] text-white">Modified Attributes</h2>
      </div>

      <div className="w-full space-y-3 relative z-0">
        {attributes.map(attr => formatAttributeChange(attr.name))}
      </div>

      <div className="flex justify-center mt-6">
        <Button 
          onClick={onConfirm}
          className="bg-white/10 text-white hover:bg-white/20"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 