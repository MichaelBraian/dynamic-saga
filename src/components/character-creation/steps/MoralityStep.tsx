import { MoralityQuestions } from "../../MoralityQuestions";
import { useToast } from "@/hooks/use-toast";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in">
      <MoralityQuestions
        characterId={characterId}
        onBack={onBack}
      />
    </div>
  );
};