import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { SpecialtyHeader } from "./specialty/SpecialtyHeader";
import { ModifiedAttributesDisplay } from "./specialty/ModifiedAttributesDisplay";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SpecialtyStepProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
}

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
  onSelect: (specialty: Specialty) => void;
  selectedId: string | null;
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
  const glowStyles = "shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-white bg-white/20 backdrop-blur-sm";

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
          <div key={specialty.id} className="w-full">
            <RadioGroupItem
              value={specialty.id}
              id={specialty.id}
              className="peer sr-only"
            />
            <div className="flex items-center gap-4 group">
              <Label
                htmlFor={specialty.id}
                className={`flex-1 flex items-center justify-between rounded-lg border-2 border-white/20 bg-white/20 p-4 hover:bg-white/30 cursor-pointer text-2xl font-['Cinzel'] text-white transition-all duration-300 ease-in-out ${
                  selectedId === specialty.id ? glowStyles : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-['Cinzel'] text-2xl text-white">
                    {specialty.name}
                  </span>
                  <InfoTooltip content={specialty.description} />
                </div>
                <div className="text-base font-medium">
                  {formatModifiersText(specialty.attribute_modifiers)}
                </div>
              </Label>
              {selectedId === specialty.id && (
                <Button
                  onClick={onContinue}
                  className={`animate-fade-in h-full py-4 px-6 font-['Cinzel'] transition-all duration-300 text-white hover:bg-white/30 ${glowStyles}`}
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

export const SpecialtyStep = ({
  characterId,
  onBack,
  onComplete,
}: SpecialtyStepProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const { data: characterClass } = useQuery({
    queryKey: ['character', characterId, 'class'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('class')
        .eq('id', characterId)
        .maybeSingle();

      if (error) throw error;
      return (data as unknown as { class: string })?.class;
    },
  });

  const { data: attributesCheck } = useQuery({
    queryKey: ['character', characterId, 'attributes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_attributes')
        .select('attribute_name, value')
        .eq('character_id', characterId);

      if (error) throw error;
      return data.length === 6;
    },
  });

  const { data: specialties, isLoading: loadingSpecialties } = useQuery({
    queryKey: ['specialties', characterClass],
    queryFn: async () => {
      if (!characterClass) return [];
      
      const { data, error } = await supabase
        .from('specialties')
        .select('id, name, description, class_type, attribute_modifiers, created_at')
        .ilike('class_type', characterClass);
      
      if (error) throw error;
      return data as unknown as Specialty[];
    },
    enabled: !!characterClass && !!attributesCheck,
  });

  const handleSpecialtySelect = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
  };

  const handleContinue = () => {
    if (!selectedSpecialty) {
      toast({
        title: "Error",
        description: "Please select a specialty first.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSpecialty = async () => {
    if (!selectedSpecialty) return;

    try {
      const { error } = await (supabase.rpc as any)('handle_specialty_selection', {
        p_character_id: characterId,
        p_specialty_id: selectedSpecialty.id,
        p_attribute_modifiers: selectedSpecialty.attribute_modifiers,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Specialty selected successfully!",
        action: <Check className="h-4 w-4" />,
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
    } else {
      onBack();
    }
  };

  if (showConfirmation && selectedSpecialty) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
        <ModifiedAttributesDisplay
          characterId={characterId}
          modifiers={selectedSpecialty.attribute_modifiers}
          onBack={handleBack}
          onConfirm={handleConfirmSpecialty}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
      <SpecialtyHeader onBack={handleBack} />
      
      {loadingSpecialties ? (
        <div>Loading specialties...</div>
      ) : specialties && specialties.length > 0 ? (
        <SpecialtyList
          specialties={specialties}
          selectedId={selectedSpecialty?.id || null}
          onSelect={handleSpecialtySelect}
          onContinue={handleContinue}
        />
      ) : (
        <div>No specialties available for your class.</div>
      )}
    </div>
  );
};