import { MoralityQuestions } from "../../MoralityQuestions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => {
  const handleContinue = async () => {
    try {
      console.log('Transitioning from morality to attributes step');
      const { error } = await supabase
        .from('characters')
        .update({ status: 'attributes' })
        .eq('id', characterId);

      if (error) {
        console.error('Error updating character status:', error);
        toast({
          variant: "destructive",
          description: "Failed to proceed to attributes. Please try again.",
        });
        return;
      }

      console.log('Successfully updated status to attributes');
    } catch (error) {
      console.error('Error in handleContinue:', error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <MoralityQuestions
        characterId={characterId}
        onBack={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
};