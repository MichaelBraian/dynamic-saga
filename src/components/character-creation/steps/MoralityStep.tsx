import { MoralityQuestions } from "../../MoralityQuestions";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => (
  <div className="animate-fade-in">
    <MoralityQuestions
      characterId={characterId}
      onBack={onBack}
    />
  </div>
);