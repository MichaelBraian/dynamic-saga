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