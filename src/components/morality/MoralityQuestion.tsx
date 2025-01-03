import { useState } from "react";
import { SelectionHeader } from "../character-selection/SelectionHeader";
import { SelectionOptions } from "../character-selection/SelectionOptions";
import { MoralityQuestion as MoralityQuestionType } from "@/types/morality";
import { getMoralityQuestionOptions } from "@/utils/moralityQuestions";

interface MoralityQuestionProps {
  question: MoralityQuestionType;
  questionNumber: number;
  onAnswerSelected: (answer: string) => void;
  onBack: () => void;
}

export const MoralityQuestion = ({
  question,
  questionNumber,
  onAnswerSelected,
  onBack,
}: MoralityQuestionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scenarioText = question.question_text.split('\n')[0];
  const options = getMoralityQuestionOptions(question.question_text);

  const handleAnswerSelected = async (answer: string) => {
    setIsSubmitting(true);
    try {
      await onAnswerSelected(answer);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <SelectionHeader 
        title={`Scenario ${questionNumber}: ${scenarioText}`}
        onBack={onBack}
        showBackButton={true}
      />
      <SelectionOptions 
        options={options}
        onValueChange={handleAnswerSelected}
        isDisabled={isSubmitting}
      />
    </div>
  );
};