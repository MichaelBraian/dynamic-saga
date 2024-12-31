import { MoralityQuestions } from "../../MoralityQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => {
  const { toast } = useToast();

  const handleContinue = async () => {
    try {
      console.log('Attempting to update character status to attributes');
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

      // If successful, the character's status update will trigger a re-render
      // through the Supabase real-time subscription in useCharacterCreation
      console.log('Successfully updated character status to attributes');
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