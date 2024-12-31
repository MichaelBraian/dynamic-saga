import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface GenderSelectionProps {
  characterId: string;
}

type Gender = "male" | "female";

const GENDER_OPTIONS: Gender[] = ["male", "female"];

export const GenderSelection = ({ characterId }: GenderSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenderSubmit = async (gender: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('characters')
        .update({ gender, status: 'questioning' })
        .eq('id', characterId);

      if (error) throw error;

      toast({
        description: `Character gender set to ${gender}`,
      });

      navigate("/");
    } catch (error) {
      console.error('Error updating gender:', error);
      toast({
        variant: "destructive",
        description: "Failed to save gender selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-['Cinzel'] text-center mb-8 text-white">Choose Gender</h1>
      
      <RadioGroup
        className="space-y-4"
        onValueChange={handleGenderSubmit}
      >
        {GENDER_OPTIONS.map((gender) => (
          <div key={gender} className="w-full">
            <RadioGroupItem
              value={gender}
              id={gender}
              className="peer sr-only"
              disabled={isSubmitting}
            />
            <Label
              htmlFor={gender}
              className="flex w-full items-center justify-center rounded-lg border-2 border-white/20 bg-white/20 p-4 hover:bg-white/30 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/30 cursor-pointer text-2xl font-['Cinzel'] text-white"
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};