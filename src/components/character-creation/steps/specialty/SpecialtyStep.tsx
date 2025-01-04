import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowRight } from "lucide-react";
import { SpecialtyHeader } from "./SpecialtyHeader";
import { ModifiedAttributesDisplay } from "./ModifiedAttributesDisplay";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Specialty {
  id: string;
  name: string;
  description: string;
  class_type: string;
  attribute_modifiers: Record<string, number>;
  created_at: string;
}

interface SpecialtyListProps {
  specialties: Specialty[];
  selectedId: string | null;
  onSelect: (specialty: Specialty) => void;
  onContinue: () => void;
}

const formatModifiersText = (modifiers: Record<string, number>) => {
  if (!modifiers) return null;

  return Object.entries(modifiers)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])) // Sort by absolute value
    .map(([attr, value], index) => {
      const prefix = value > 0 ? '+' : '';
      const modifierClass = value > 0 ? 'text-emerald-400' : 'text-rose-400';
      
      return (
        <span key={attr} className="whitespace-nowrap">
          {index > 0 && <span className="text-white/50">, </span>}
          <span className={modifierClass}>
            {prefix}{value} {attr}
          </span>
        </span>
      );
    });
};

const SpecialtyList = ({ specialties, onSelect, selectedId, onContinue }: SpecialtyListProps) => {
  return (
    <div className="space-y-4">
      <RadioGroup
        className="space-y-4 animate-fade-in"
        onValueChange={(value) => {
          const specialty = specialties.find(s => s.id === value);
          if (specialty) onSelect(specialty);
        }}
        value={selectedId || undefined}
      >
        {specialties?.map((specialty) => (
          <div key={specialty.id} className="transition-all duration-200">
            <div className="flex items-center gap-4 group">
              <div className="flex-1">
                <RadioGroupItem
                  value={specialty.id}
                  id={specialty.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={specialty.id}
                  className="block w-full cursor-pointer rounded-lg border-2 border-white/20 bg-black/30 p-4 transition-all duration-200 hover:bg-white/10 hover:border-white/30 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/20"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-['Cinzel'] text-2xl text-white">
                        {specialty.name}
                      </span>
                      <InfoTooltip content={specialty.description} />
                    </div>
                    <div className="text-base font-medium flex-shrink-0 ml-4">
                      {formatModifiersText(specialty.attribute_modifiers)}
                    </div>
                  </div>
                </Label>
              </div>
              {selectedId === specialty.id && (
                <Button 
                  onClick={onContinue}
                  className="bg-white/10 text-white hover:bg-white/20 font-['Cinzel'] h-full py-4 px-6"
                >
                  <ArrowRight className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}; 