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
    console.log('Handling continue in MoralityStep');
    try {
      // Double-check that morality scores exist before proceeding
      const { data: morality, error: moralityError } = await supabase
        .from('character_morality')
        .select('*')
        .eq('character_id', characterId)
        .single();

      if (moralityError || !morality) {
        console.error('Morality scores not found:', moralityError);
        toast({
          variant: "destructive",
          description: "Please complete all morality questions before continuing.",
        });
        return;
      }

      // Update the character status directly
      const { error: updateError } = await supabase
        .from('characters')
        .update({ status: 'attributes' })
        .eq('id', characterId);

      if (updateError) {
        console.error('Error updating character status:', updateError);
        throw updateError;
      }

      console.log('Successfully updated character status to attributes');
    } catch (error) {
      console.error('Error transitioning to attributes:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed to attributes. Please try again.",
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