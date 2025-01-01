import { useMoralityQuestions } from "@/hooks/useMoralityQuestions";
import { useMoralityQuestionsState } from "@/hooks/useMoralityQuestionsState";
import { MoralityQuestionCard } from "./morality/MoralityQuestionCard";
import { MoralityScoreDisplay } from "./morality/MoralityScoreDisplay";
import { LoadingQuestions } from "./morality/LoadingQuestions";
import { NoQuestionsAvailable } from "./morality/NoQuestionsAvailable";

interface MoralityQuestionsProps {
  characterId: string;
  onBack: () => void;
  onContinue: () => void;
}

export const MoralityQuestions = ({ 
  characterId, 
  onBack, 
  onContinue 
}: MoralityQuestionsProps) => {
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    isLoading,
    saveResponse,
  } = useMoralityQuestions(characterId);

  const {
    isComplete,
    isSubmitting,
    handleAnswerSelected
  } = useMoralityQuestionsState(characterId, onBack, onContinue);

  if (isLoading) {
    return <LoadingQuestions />;
  }

  if (!currentQuestion && !isComplete) {
    return <NoQuestionsAvailable />;
  }

  if (isComplete) {
    return (
      <div className="pt-16 animate-fade-in">
        <MoralityScoreDisplay 
          characterId={characterId}
          onContinue={onContinue}
        />
      </div>
    );
  }

  return (
    <div className="pt-16">
      <MoralityQuestionCard
        question={currentQuestion}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        onAnswerSelected={handleAnswerSelected}
        onBack={onBack}
      />
    </div>
  );
};