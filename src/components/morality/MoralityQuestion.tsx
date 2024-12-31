import { CharacterSelectionScreen } from "../CharacterSelectionScreen";
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
  const scenarioText = question.question_text.split('\n')[0];
  const options = getMoralityQuestionOptions(question.question_text);

  return (
    <CharacterSelectionScreen
      title={`Scenario ${questionNumber}: ${scenarioText}`}
      options={options}
      characterId=""
      onSelected={onAnswerSelected}
      onBack={onBack}
      updateField="morality_response"
      nextStatus="questioning"
      showBackButton={true}
    />
  );
};