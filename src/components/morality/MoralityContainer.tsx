import { MoralityQuestions } from "@/components/MoralityQuestions";
import { useMoralityQuestions } from "@/hooks/useMoralityQuestions";

interface MoralityContainerProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityContainer = ({ characterId, onBack }: MoralityContainerProps) => {
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    isLoading,
    saveResponse,
  } = useMoralityQuestions(characterId);

  return (
    <div className="pt-16">
      <MoralityQuestions
        characterId={characterId}
        onBack={onBack}
      />
    </div>
  );
};