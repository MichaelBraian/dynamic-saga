import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMoralityQuestions } from "@/hooks/useMoralityQuestions";
import { MoralityQuestionCard } from "./morality/MoralityQuestionCard";
import { MoralityScoreDisplay } from "./morality/MoralityScoreDisplay";

interface MoralityQuestionsProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityQuestions = ({ characterId, onBack }: MoralityQuestionsProps) => {
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    isLoading,
    saveResponse,
  } = useMoralityQuestions(characterId);

  const handleAnswerSelected = async (answer: string) => {
    try {
      const complete = await saveResponse(answer);
      if (complete) {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      toast({
        variant: "destructive",
        description: "Failed to save your response. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
          <p className="text-white text-center">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion && !isComplete) {
    return (
      <div className="pt-16">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
          <p className="text-white text-center">No questions available.</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="pt-16 animate-fade-in">
        <MoralityScoreDisplay characterId={characterId} />
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