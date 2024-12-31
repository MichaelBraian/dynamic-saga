import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MoralityQuestion as MoralityQuestionComponent } from "./morality/MoralityQuestion";
import { 
  MoralityQuestion,
  fetchMoralityQuestion,
  saveMoralityResponse,
  updateCharacterStatus
} from "@/utils/moralityQuestions";

interface MoralityQuestionsProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityQuestions = ({ characterId, onBack }: MoralityQuestionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<MoralityQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async (previousQuestionId?: string) => {
    try {
      const question = await fetchMoralityQuestion(previousQuestionId);
      setCurrentQuestion(question);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading question:', error);
      toast({
        variant: "destructive",
        description: "Failed to load question. Please try again.",
      });
    }
  };

  const handleAnswerSelected = async (answer: string) => {
    if (!currentQuestion) return;

    try {
      await saveMoralityResponse(characterId, currentQuestion.id, answer);
      
      // Load next question
      const nextQuestion = await fetchMoralityQuestion(currentQuestion.id);
      
      if (nextQuestion) {
        setQuestionNumber(prev => prev + 1);
        setCurrentQuestion(nextQuestion);
      } else {
        // No more questions, update status and navigate
        await updateCharacterStatus(characterId, 'questioning');
        navigate("/");
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      toast({
        variant: "destructive",
        description: "Failed to save your response. Please try again.",
      });
    }
  };

  const handleBack = () => {
    if (questionNumber === 1) {
      onBack();
    } else {
      setQuestionNumber(prev => prev - 1);
      loadQuestion();
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading questions...</div>;
  }

  if (!currentQuestion) return null;

  return (
    <div className="pt-16">
      <MoralityQuestionComponent
        question={currentQuestion}
        questionNumber={questionNumber}
        onAnswerSelected={handleAnswerSelected}
        onBack={handleBack}
      />
    </div>
  );
};