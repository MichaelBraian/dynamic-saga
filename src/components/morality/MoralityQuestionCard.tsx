import { MoralityQuestion } from "@/types/morality";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MoralityQuestionCardProps {
  question: MoralityQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelected: (answer: string) => void;
  onBack: () => void;
}

export const MoralityQuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelected,
  onBack,
}: MoralityQuestionCardProps) => {
  const options = question.question_text
    .split('\n')
    .slice(1)
    .map(option => option.trim())
    .filter(option => option.match(/^\d\./));

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-['Cinzel'] text-center flex-1 text-white">
          Question {questionNumber} of {totalQuestions}
        </h1>
        <div className="w-10" />
      </div>

      <div className="mb-6">
        <p className="text-xl text-white mb-4 font-['IM_Fell_English']">
          {question.question_text.split('\n')[0]}
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswerSelected(option)}
            className="w-full text-left p-4 rounded-lg border-2 border-white/20 bg-white/20 hover:bg-white/30 text-white transition-colors text-2xl font-['Cinzel']"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};