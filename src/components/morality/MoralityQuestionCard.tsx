import { useState } from "react";
import { SelectionHeader } from "../character-selection/SelectionHeader";
import { SelectionOptions } from "../character-selection/SelectionOptions";
import { MoralityQuestion } from "@/types/morality";

interface MoralityQuestionCardProps {
  question: MoralityQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelected: (answer: string) => void;
  onBack: () => void;
  previousResponse?: string;
}

export const MoralityQuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelected,
  onBack,
  previousResponse,
}: MoralityQuestionCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = question.question_text
    .split('\n')
    .slice(1)
    .map(option => option.trim())
    .filter(option => option.match(/^\d\./))
    .map(option => ({
      value: option,
      label: option,
    }));

  const scenarioText = question.question_text.split('\n')[0];
  const title = `Question ${questionNumber} of ${totalQuestions}`;

  const handleAnswerSelected = async (answer: string) => {
    setIsSubmitting(true);
    try {
      await onAnswerSelected(answer);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
        <SelectionHeader 
          title={title}
          onBack={onBack}
          showBackButton={true}
        />
        <SelectionOptions 
          options={options}
          onValueChange={handleAnswerSelected}
          isDisabled={isSubmitting}
          initialValue={previousResponse}
        />
      </div>
      <p className="mt-4 text-xl text-white text-center font-['IM_Fell_English'] max-w-md mx-auto">
        {scenarioText}
      </p>
    </div>
  );
};