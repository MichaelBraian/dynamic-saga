import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

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
      // Save specialty selection
      const { error: specialtyError } = await supabase
        .from('character_specialties')
        .upsert({ character_id: characterId, specialty_id: specialtyId });

      if (specialtyError) throw specialtyError;

      // Update character status
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

      <div className="space-y-4">
        {specialties?.map((specialty) => (
          <div
            key={specialty.id}
            className="p-4 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
            onClick={() => !isSubmitting && handleSpecialtySelect(specialty.id)}
          >
            <h3 className="text-xl font-['Cinzel'] text-white mb-2">{specialty.name}</h3>
            <p className="text-white/80 mb-2">{specialty.description}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(specialty.attribute_modifiers).map(([attr, mod]) => (
                <span
                  key={attr}
                  className={`px-2 py-1 rounded text-sm ${
                    mod > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {attr.charAt(0).toUpperCase() + attr.slice(1)}: {formatModifier(mod)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};