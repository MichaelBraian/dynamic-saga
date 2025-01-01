import { MoralityQuestions } from "../../MoralityQuestions";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => {
  const { updateStatus } = useCharacterStatusUpdate();

  const handleContinue = async () => {
    console.log('Transitioning from morality to attributes step');
    const success = await updateStatus(characterId, 'attributes');
    if (!success) {
      console.error('Failed to update status to attributes');
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