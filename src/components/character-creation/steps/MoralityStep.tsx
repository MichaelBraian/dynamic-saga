import { MoralityQuestions } from "../../MoralityQuestions";
import { useToast } from "@/hooks/use-toast";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const MoralityStep = ({ characterId, onBack, onComplete }: MoralityStepProps) => {
  const { toast } = useToast();
  const { updateStatus } = useCharacterStatusUpdate();

  const handleBack = async () => {
    try {
      const success = await updateStatus(characterId, 'armor');
      if (success) {
        onBack();
      } else {
        toast({
          variant: "destructive",
          description: "Failed to go back. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error updating character status:', error);
      toast({
        variant: "destructive",
        description: "Failed to go back. Please try again.",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <MoralityQuestions
        characterId={characterId}
        onBack={handleBack}
        onComplete={onComplete}
      />
    </div>
  );
};