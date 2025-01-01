import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMoralityQuestions } from "@/hooks/useMoralityQuestions";
import { MoralityQuestionCard } from "./morality/MoralityQuestionCard";
import { MoralityScoreDisplay } from "./morality/MoralityScoreDisplay";
import { supabase } from "@/integrations/supabase/client";

interface MoralityQuestionsProps {
  characterId: string;
  onBack: () => void;
  onContinue: () => void;
}

export const MoralityQuestions = ({ characterId, onBack, onContinue }: MoralityQuestionsProps) => {
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    isLoading,
    saveResponse,
  } = useMoralityQuestions(characterId);

  const handleAnswerSelected = async (answer: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Verify character exists and belongs to current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data: character, error: verifyError } = await supabase
        .from('characters')
        .select('user_id, status')
        .eq('id', characterId)
        .single();

      if (verifyError || !character) {
        throw new Error("Character not found");
      }

      if (character.user_id !== user.id) {
        throw new Error("Unauthorized");
      }

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
    } finally {
      setIsSubmitting(false);
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