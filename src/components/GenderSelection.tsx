import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GenderSelectionProps {
  characterId: string;
}

export const GenderSelection = ({ characterId }: GenderSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenderSubmit = async (gender: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .update({ gender, status: 'questioning' })
        .eq('id', characterId);

      if (error) throw error;

      toast({
        description: "Gender selected successfully",
      });

      // TODO: Navigate to questions page once implemented
      navigate("/");
    } catch (error) {
      console.error('Error updating gender:', error);
      toast({
        variant: "destructive",
        description: "Failed to save gender selection",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center font-['Cinzel']">Choose Gender</h1>
      
      <RadioGroup
        className="grid grid-cols-2 gap-4"
        onValueChange={handleGenderSubmit}
      >
        <div>
          <RadioGroupItem
            value="male"
            id="male"
            className="peer sr-only"
          />
          <Label
            htmlFor="male"
            className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-xl font-semibold"
          >
            Male
          </Label>
        </div>

        <div>
          <RadioGroupItem
            value="female"
            id="female"
            className="peer sr-only"
          />
          <Label
            htmlFor="female"
            className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-xl font-semibold"
          >
            Female
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};