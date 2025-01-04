import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Check, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CharacterSelectionScreen } from "@/components/CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/lib/database.types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface SpecialtyStepProps {
  characterId: string;
  onComplete: () => void;
  onBack: () => void;
}

interface Specialty {
  id: string;
  name: string;
  description: string;
  class_type: string;
  created_at: string;
  attribute_modifiers: Record<string, number>;
}

export function SpecialtyStep({ characterId, onComplete, onBack }: SpecialtyStepProps) {
  const { toast } = useToast();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSpecialties = async () => {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .eq('class_type', 'Druid');

      if (error) {
        console.error('Error fetching specialties:', error);
        return;
      }

      setSpecialties(data as unknown as Specialty[]);
    };

    fetchSpecialties();
  }, []);

  const getAttributeModifiers = (specialty: Specialty): Record<string, number> => {
    return specialty.attribute_modifiers || {};
  };

  const formatModifier = (value: number | undefined) => {
    if (!value || value === 0) return '';
    return value > 0 ? `+${value}` : value.toString();
  };

  const formatModifiersText = (modifiers: Record<string, number>) => {
    const formattedModifiers = Object.entries(modifiers)
      .filter(([_, value]) => value !== 0)
      .map(([attr, value]) => {
        const formattedValue = formatModifier(value);
        return `${formattedValue} ${attr}`;
      })
      .join(', ');

    return formattedModifiers;
  };

  const specialtyOptions = specialties?.map((specialty) => {
    const modifiers = getAttributeModifiers(specialty);
    return {
      value: specialty.id,
      label: specialty.name,
      labelComponent: (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{specialty.name}</div>
            <HoverCard>
              <HoverCardTrigger>
                <HelpCircle className="h-4 w-4 text-white/60 hover:text-white/80 transition-colors" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-black/90 border-white/20 text-white backdrop-blur-sm">
                <p className="text-sm">{specialty.description}</p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="text-sm">
            {Object.entries(modifiers)
              .filter(([_, value]) => value !== 0)
              .map(([attr, value]) => (
                <span
                  key={attr}
                  className={cn(
                    "inline-block mr-2",
                    value > 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {formatModifier(value)} {attr}
                </span>
              ))}
          </div>
        </div>
      ),
    };
  });

  const handleSpecialtySelected = async (specialtyId: string) => {
    setIsSubmitting(true);

    try {
      const specialty = specialties?.find(s => s.id === specialtyId);
      if (!specialty) throw new Error("Selected specialty not found");

      const { error } = await supabase.rpc('handle_specialty_selection', {
        p_character_id: characterId,
        p_specialty_id: specialtyId
      });

      if (error) throw error;

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

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Your Specialty"
        options={specialtyOptions || []}
        characterId={characterId}
        onSelected={handleSpecialtySelected}
        onBack={onBack}
        updateField="specialty"
        nextStatus="faith_points"
      />
    </div>
  );
}