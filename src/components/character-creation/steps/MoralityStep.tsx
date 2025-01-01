import { MoralityQuestions } from "../../MoralityQuestions";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => {
  const { updateStatus } = useCharacterStatusUpdate();

  const handleContinue = async () => {
    await updateStatus(characterId, 'attributes');
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