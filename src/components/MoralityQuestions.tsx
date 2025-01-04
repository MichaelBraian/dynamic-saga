import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMoralityQuestions } from "@/hooks/useMoralityQuestions";
import { MoralityQuestionCard } from "./morality/MoralityQuestionCard";
import { MoralityScoreDisplay } from "./morality/MoralityScoreDisplay";
import { supabase } from "@/integrations/supabase/client";
import { useMoralityCalculation } from "@/hooks/morality/useMoralityCalculation";
import { useMoralityNavigation } from "@/hooks/morality/useMoralityNavigation";

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
  const [hasChanges, setHasChanges] = useState(false);
  const {
    questions,
    totalQuestions,
    isLoading,
    handleResponse,
    previousResponses,
    allResponses,
  } = useMoralityQuestions(characterId);

  const navigation = useMoralityNavigation(totalQuestions);
  const { calculateMoralityScore } = useMoralityCalculation();

  // If startAtLastQuestion is true, go to the last question
  useEffect(() => {
    if (startAtLastQuestion && totalQuestions > 0) {
      navigation.goToQuestion(totalQuestions - 1);
    }
  }, [startAtLastQuestion, totalQuestions, navigation]);

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
      const currentQuestion = questions[navigation.currentIndex];
      if (!currentQuestion) {
        console.error('No current question available');
        toast({
          variant: "destructive",
          description: "No question available. Please try again.",
        });
        return;
      }

      const success = await handleResponse(answer, currentQuestion.id);
      setHasChanges(true);
      
      if (success) {
        // If we have responses and changes, recalculate score
        if (allResponses.length > 0) {
          const { data: character } = await supabase
            .from('characters')
            .select('*')
            .eq('id', characterId)
            .single();
          
          if (character) {
            await calculateMoralityScore(allResponses, character);
          }
        }

        if (navigation.currentIndex === totalQuestions - 1) {
          // Wait for the status update before showing completion
          const statusUpdated = await updateCharacterStatus();
          if (statusUpdated) {
            setIsComplete(true);
          }
        } else {
          navigation.goForward();
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
    if (navigation.canGoBack) {
      navigation.goBack();
    } else {
      onBack();
    }
  };

  const handleScoreBack = async () => {
    // Recalculate score when going back from score display
    if (hasChanges) {
      const { data: character } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single();
      
      if (character) {
        await calculateMoralityScore(allResponses, character);
      }
      setHasChanges(false);
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

  const currentQuestion = questions[navigation.currentIndex];

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
        questionNumber={navigation.currentIndex + 1}
        totalQuestions={totalQuestions}
        onAnswerSelected={handleAnswerSelected}
        onBack={handleBack}
        characterId={characterId}
        previousResponses={previousResponses}
      />
    </div>
  );
};