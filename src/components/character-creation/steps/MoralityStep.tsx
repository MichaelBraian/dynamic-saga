import { MoralityQuestions } from "../../MoralityQuestions";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => {
  const { updateStatus } = useCharacterStatusUpdate();

  const handleContinue = async () => {
    console.log('Handling continue in MoralityStep');
    const success = await updateStatus(characterId, 'attributes');
    if (success) {
      console.log('Successfully updated status to attributes in MoralityStep');
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