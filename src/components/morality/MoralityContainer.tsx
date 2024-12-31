import { MoralityQuestions } from "./MoralityQuestions";
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
        question={currentQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        isLoading={isLoading}
        onAnswerSelected={saveResponse}
        onBack={onBack}
      />
    </div>
  );
};