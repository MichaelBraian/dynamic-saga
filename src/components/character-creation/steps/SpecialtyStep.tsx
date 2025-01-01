import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SpecialtyStateDisplay } from "./specialty/SpecialtyStateDisplay";
import { SpecialtyList } from "./specialty/SpecialtyList";
import { SpecialtyHeader } from "./specialty/SpecialtyHeader";

interface SpecialtyStepProps {
  characterId: string;
  characterClass: string;
  onBack: () => void;
  onComplete: () => void;
}

interface Specialty {
  id: string;
  name: string;
  description: string;
  attribute_modifiers: Record<string, number>;
  class_type: string;
  created_at: string;
}

export const SpecialtyStep = ({
  characterId,
  characterClass,
  onBack,
  onComplete,
}: SpecialtyStepProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: attributesCheck, isLoading: checkingAttributes } = useQuery({
    queryKey: ['attributes-check', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_attributes')
        .select('attribute_name')
        .eq('character_id', characterId);
      
      if (error) throw error;
      return data?.length === 6;
    }
  });

  const { data: specialties, isLoading: loadingSpecialties } = useQuery({
    queryKey: ['specialties', characterClass],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .eq('class_type', characterClass);
      
      if (error) throw error;
      
      // Transform the data to ensure attribute_modifiers is correctly typed
      return (data || []).map(specialty => ({
        ...specialty,
        attribute_modifiers: specialty.attribute_modifiers as Record<string, number>
      })) as Specialty[];
    },
    enabled: !!attributesCheck,
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

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
      <SpecialtyStateDisplay
        isLoading={checkingAttributes || loadingSpecialties}
        attributesIncomplete={!attributesCheck}
        onBack={onBack}
      />
      
      {attributesCheck && specialties && (
        <>
          <SpecialtyHeader onBack={onBack} />
          <SpecialtyList
            specialties={specialties}
            onSelect={handleSpecialtySelect}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  );
};