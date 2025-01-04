import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";
import { MoralityQuestions } from "../../MoralityQuestions";
import { MoralityScoreDisplay } from "../../morality/MoralityScoreDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const MoralityStep = ({ characterId, onBack, onComplete }: MoralityStepProps) => {
  const { toast } = useToast();
  const { updateStatus } = useCharacterStatusUpdate();
  const [showQuestions, setShowQuestions] = useState(true);
  const [returningFromClothing, setReturningFromClothing] = useState(false);

  // Check if morality score exists (meaning questions were already answered)
  const { data: morality, isLoading, refetch } = useQuery({
    queryKey: ['morality-score', characterId],
    queryFn: async () => {
      const { data: responses } = await supabase
        .from('character_responses')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false }); // Get latest responses first

      // If we have responses, show the score display
      if (responses && responses.length > 0) {
        // Get unique responses (latest response for each question)
        const uniqueResponses = Object.values(
          responses.reduce((acc: any, curr) => {
            if (!acc[curr.question_id] || new Date(curr.created_at) > new Date(acc[curr.question_id].created_at)) {
              acc[curr.question_id] = curr;
            }
            return acc;
          }, {})
        );

        const { data } = await supabase
          .from('character_morality')
          .select('*')
          .eq('character_id', characterId)
          .maybeSingle();

        return {
          morality: data,
          hasResponses: true,
          responses: uniqueResponses
        };
      }

      return {
        morality: null,
        hasResponses: false,
        responses: []
      };
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0
  });

  // Reset states when returning from clothing
  useEffect(() => {
    if (returningFromClothing) {
      setShowQuestions(true);
      setReturningFromClothing(false);
      // Refetch to ensure we have the latest data
      refetch();
    }
  }, [returningFromClothing, refetch]);

  const handleBack = async () => {
    // If we're showing the score display, go back to questions
    if (!showQuestions && morality?.morality) {
      setShowQuestions(true);
      return;
    }

    try {
      const success = await updateStatus(characterId, 'clothing');
      if (success) {
        setReturningFromClothing(true);
        onBack();
      } else {
        toast({
          variant: "destructive",
          description: "Failed to go back. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error updating character status:', error);
      toast({
        variant: "destructive",
        description: "Failed to go back. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {!showQuestions && morality?.morality ? (
        <MoralityScoreDisplay
          characterId={characterId}
          onBack={handleBack}
          onContinue={onComplete}
        />
      ) : (
        <MoralityQuestions
          characterId={characterId}
          onBack={handleBack}
          onComplete={() => {
            setShowQuestions(false);
            onComplete();
          }}
          startAtLastQuestion={false}
        />
      )}
    </div>
  );
}