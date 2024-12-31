import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMoralityQuestions } from "@/hooks/useMoralityQuestions";
import { MoralityQuestionCard } from "./morality/MoralityQuestionCard";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MoralityQuestionsProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityQuestions = ({ characterId, onBack }: MoralityQuestionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    isLoading,
    saveResponse,
  } = useMoralityQuestions(characterId);

  useEffect(() => {
    const verifyCharacterStatus = async () => {
      const { data: character, error } = await supabase
        .from('characters')
        .select('status')
        .eq('id', characterId)
        .single();

      if (error) {
        console.error('Error verifying character status:', error);
        return;
      }

      console.log('Current character status:', character?.status);
    };

    verifyCharacterStatus();
  }, [characterId]);

  const handleAnswerSelected = async (answer: string) => {
    try {
      const isComplete = await saveResponse(answer);
      if (isComplete) {
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

  if (isLoading) {
    return (
      <div className="pt-16">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
          <p className="text-white text-center">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="pt-16">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
          <p className="text-white text-center">No questions available.</p>
        </div>
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