import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SpecialtyStateDisplay } from "./specialty/SpecialtyStateDisplay";
import { SpecialtyList } from "./specialty/SpecialtyList";
import { SpecialtyHeader } from "./specialty/SpecialtyHeader";
import { ModifiedAttributesDisplay } from "./specialty/ModifiedAttributesDisplay";

// Add attribute code mapping
const ATTRIBUTE_CODES: Record<string, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA"
};

const REVERSE_ATTRIBUTE_CODES: Record<string, string> = {
  STR: "strength",
  DEX: "dexterity",
  CON: "constitution",
  INT: "intelligence",
  WIS: "wisdom",
  CHA: "charisma"
};

interface SpecialtyStepProps {
  characterId: string;
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
  onBack,
  onComplete,
}: SpecialtyStepProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [showModifiedAttributes, setShowModifiedAttributes] = useState(false);

  // First, fetch the character's class
  const { data: characterClass, isLoading: loadingClass } = useQuery({
    queryKey: ['character-class', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('class')
        .eq('id', characterId)
        .single();
      
      if (error) throw error;
      return data?.class;
    }
  });

  // Fetch current attributes
  const { data: currentAttributes, isLoading: loadingAttributes } = useQuery({
    queryKey: ['character-attributes', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_attributes')
        .select('attribute_name, value')
        .eq('character_id', characterId);
      
      if (error) throw error;
      
      // Convert three-letter codes to full names for display
      return data.reduce((acc, curr) => ({
        ...acc,
        [curr.attribute_name]: curr.value
      }), {} as Record<string, number>);
    }
  });

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
      if (!characterClass) return [];
      
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .eq('class_type', characterClass);
      
      if (error) throw error;
      
      return (data || []).map(specialty => ({
        ...specialty,
        // Convert specialty modifiers to use three-letter codes
        attribute_modifiers: Object.entries(specialty.attribute_modifiers as Record<string, number>)
          .reduce((acc, [key, value]) => ({
            ...acc,
            [ATTRIBUTE_CODES[key.toLowerCase()]]: value
          }), {})
      })) as Specialty[];
    },
    enabled: !!characterClass && !!attributesCheck,
  });

  const handleSpecialtySelect = async (specialtyId: string) => {
    const specialty = specialties?.find(s => s.id === specialtyId);
    if (!specialty) return;
    
    setSelectedSpecialty(specialty);
    setShowModifiedAttributes(true);
  };

  const handleConfirmSpecialty = async () => {
    if (!selectedSpecialty) return;
    
    setIsSubmitting(true);
    try {
      const { error: specialtyError } = await supabase
        .from('character_specialties')
        .upsert(
          { 
            character_id: characterId, 
            specialty_id: selectedSpecialty.id 
          },
          {
            onConflict: 'character_id',
            ignoreDuplicates: false
          }
        );

      if (specialtyError) throw specialtyError;

      // Update attributes with modifiers
      const updatedAttributes = Object.entries(currentAttributes || {}).map(([name, value]) => ({
        character_id: characterId,
        attribute_name: name,
        value: value + (selectedSpecialty.attribute_modifiers[name] || 0)
      }));

      const { error: attributesError } = await supabase
        .from('character_attributes')
        .upsert(
          updatedAttributes,
          {
            onConflict: 'character_id,attribute_name',
            ignoreDuplicates: false
          }
        );

      if (attributesError) throw attributesError;

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

  const handleBackToSpecialties = () => {
    setSelectedSpecialty(null);
    setShowModifiedAttributes(false);
  };

  const getModifiedAttributes = () => {
    if (!currentAttributes || !selectedSpecialty) return {};
    
    return Object.entries(currentAttributes).reduce((acc, [name, value]) => ({
      ...acc,
      [name]: value + (selectedSpecialty.attribute_modifiers[name] || 0)
    }), {});
  };

  const isLoading = loadingClass || checkingAttributes || loadingSpecialties || loadingAttributes;

  if (showModifiedAttributes && selectedSpecialty && currentAttributes) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
        <ModifiedAttributesDisplay
          originalAttributes={currentAttributes}
          modifiedAttributes={getModifiedAttributes()}
          onBack={handleBackToSpecialties}
          onContinue={handleConfirmSpecialty}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
      <SpecialtyStateDisplay
        isLoading={isLoading}
        attributesIncomplete={!attributesCheck}
        onBack={onBack}
      />
      
      {attributesCheck && specialties && characterClass && (
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