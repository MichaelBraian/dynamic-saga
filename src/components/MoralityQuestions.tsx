import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMoralityQuestions } from "@/hooks/useMoralityQuestions";
import { MoralityQuestionCard } from "./morality/MoralityQuestionCard";
import { MoralityScoreDisplay } from "./morality/MoralityScoreDisplay";
import { supabase } from "@/integrations/supabase/client";
import { useMoralityCalculation } from "@/hooks/morality/useMoralityCalculation";

interface MoralityQuestionsProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
  startAtLastQuestion?: boolean;
}

export const MoralityQuestions = ({ 
  characterId, 
  onBack, 
  onComplete,
  startAtLastQuestion = false 
}: MoralityQuestionsProps) => {
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    isLoading,
    handleResponse,
    goToQuestion,
    previousResponses,
    allResponses,
  } = useMoralityQuestions(characterId);
  const { calculateMoralityScore } = useMoralityCalculation();

  // If startAtLastQuestion is true, go to the last question
  useEffect(() => {
    if (startAtLastQuestion && totalQuestions > 0) {
      goToQuestion(totalQuestions - 1);
    }
  }, [startAtLastQuestion, totalQuestions, goToQuestion]);

  const updateCharacterStatus = async () => {
    const { error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();

    if (error) {
      console.error('Error fetching character:', error);
      toast({
        variant: "destructive",
        description: "Failed to update character status. Please try again.",
      });
      return false;
    }

    const { error: updateError } = await supabase
      .from('characters')
      .update({ status: 'completed' })
      .eq('id', characterId);

    if (updateError) {
      console.error('Error updating character status:', updateError);
      toast({
        variant: "destructive",
        description: "Failed to update character status. Please try again.",
      });
      return false;
    }
    return true;
  };

  const handleAnswerSelected = async (answer: string) => {
    try {
      if (!currentQuestion) {
        console.error('No current question available');
        toast({
          variant: "destructive",
          description: "No question available. Please try again.",
        });
        return;
      }

      const complete = await handleResponse(answer);
      
      // Only calculate morality score if we have at least one saved response
      if (allResponses.length > 0) {
        // Recalculate morality score after each answer change
        const { data: character } = await supabase
          .from('characters')
          .select('*')
          .eq('id', characterId)
          .single();
        
        if (character) {
          await calculateMoralityScore(allResponses, character);
        }
      }

      if (complete) {
        // Wait for the status update before showing completion
        const statusUpdated = await updateCharacterStatus();
        if (statusUpdated) {
          setIsComplete(true);
        }
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
    if (questionNumber > 1) {
      goToQuestion(questionNumber - 2); // -2 because questionNumber is 1-indexed and we want the previous question
    } else {
      onBack();
    }
  };

  const handleScoreBack = async () => {
    // Recalculate score when going back from score display
    const { data: character } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();
    
    if (character) {
      await calculateMoralityScore(allResponses, character);
    }
    setIsComplete(false);
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
          onContinue={onComplete}
          onBack={handleScoreBack}
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
        onBack={handleBack}
        characterId={characterId}
        previousResponses={previousResponses}
      />
    </div>
  );
};