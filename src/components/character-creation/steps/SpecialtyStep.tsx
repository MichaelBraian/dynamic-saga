import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Specialty {
  id: string;
  name: string;
  description: string;
  attribute_modifiers: Record<string, number>;
}

interface SpecialtyStepProps {
  characterId: string;
  characterClass: string;
  onBack: () => void;
  onComplete: () => void;
}

export const SpecialtyStep = ({ characterId, characterClass, onBack, onComplete }: SpecialtyStepProps) => {
  const { toast } = useToast();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: specialties, isLoading } = useQuery({
    queryKey: ['specialties', characterClass],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .eq('class_type', characterClass);
      
      if (error) throw error;
      return data as Specialty[];
    }
  });

  const handleSpecialtySelect = async (specialtyId: string) => {
    setIsSubmitting(true);
    try {
      const { error: specialtyError } = await supabase
        .from('character_specialties')
        .upsert({ character_id: characterId, specialty_id: specialtyId });

      if (specialtyError) throw specialtyError;

      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'faith_points' })
        .eq('id', characterId);

      if (statusError) throw statusError;

      toast({
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Specialty selected successfully</span>
          </div>
        ),
      });

      onComplete();
    } catch (error) {
      console.error('Error selecting specialty:', error);
      toast({
        variant: "destructive",
        description: "Failed to select specialty. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatModifier = (value: number) => {
    return value > 0 ? `+${value}` : value.toString();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <p className="text-white text-center">Loading specialties...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-['Cinzel'] text-center flex-1 text-white">Choose Your Specialty</h1>
        <div className="w-10" />
      </div>

      <RadioGroup
        className="space-y-4"
        onValueChange={handleSpecialtySelect}
        disabled={isSubmitting}
      >
        {specialties?.map((specialty) => (
          <div key={specialty.id}>
            <RadioGroupItem
              value={specialty.id}
              id={specialty.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={specialty.id}
              className="flex w-full items-center justify-between rounded-lg border-2 border-white/20 bg-white/20 p-4 hover:bg-white/30 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/30 cursor-pointer text-2xl font-['Cinzel'] text-white"
            >
              <div className="flex items-center gap-2">
                {specialty.name}
                <InfoTooltip content={`${specialty.description}
                  ${Object.entries(specialty.attribute_modifiers)
                    .map(([attr, mod]) => `\n${attr.charAt(0).toUpperCase() + attr.slice(1)}: ${formatModifier(mod)}`)
                    .join('')}`} 
                />
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};