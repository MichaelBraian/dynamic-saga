import { MoralityQuestions } from "../../MoralityQuestions";
import { useToast } from "@/hooks/use-toast";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const MoralityStep = ({ characterId, onBack, onComplete }: MoralityStepProps) => {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in">
      <MoralityQuestions
        characterId={characterId}
        onBack={onBack}
        onComplete={onComplete}
      />
    </div>
  );
};