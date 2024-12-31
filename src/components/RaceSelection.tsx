import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface RaceSelectionProps {
  characterId: string;
}

type Race = "Human" | "Dwarf" | "Animal";

const RACE_OPTIONS: Race[] = ["Human", "Dwarf", "Animal"];

export const RaceSelection = ({ characterId }: RaceSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRaceSubmit = async (race: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('characters')
        .update({ race, status: 'attributes' })
        .eq('id', characterId);

      if (error) throw error;

      toast({
        description: `Character race set to ${race}`,
      });

      navigate("/");
    } catch (error) {
      console.error('Error updating race:', error);
      toast({
        variant: "destructive",
        description: "Failed to save race selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-['Cinzel'] text-center mb-8 text-white">Choose Race</h1>
      
      <RadioGroup
        className="space-y-4"
        onValueChange={handleRaceSubmit}
      >
        {RACE_OPTIONS.map((race) => (
          <div key={race} className="w-full">
            <RadioGroupItem
              value={race}
              id={race}
              className="peer sr-only"
              disabled={isSubmitting}
            />
            <Label
              htmlFor={race}
              className="flex w-full items-center justify-center rounded-lg border-2 border-white/20 bg-white/20 p-4 hover:bg-white/30 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/30 cursor-pointer text-2xl font-['Cinzel'] text-white"
            >
              {race}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};