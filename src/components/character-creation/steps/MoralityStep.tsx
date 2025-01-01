import { MoralityQuestions } from "../../MoralityQuestions";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";
import { useToast } from "@/hooks/use-toast";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => {
  const { updateStatus } = useCharacterStatusUpdate();
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

      console.log('Morality scores found, proceeding to attributes');
      const success = await updateStatus(characterId, 'attributes');
      if (success) {
        console.log('Successfully updated status to attributes in MoralityStep');
      } else {
        throw new Error('Failed to update status');
      }
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