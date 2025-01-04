import { MoralityQuestions } from "../../MoralityQuestions";
import { useToast } from "@/hooks/use-toast";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";
import { MoralityScoreDisplay } from "../../morality/MoralityScoreDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const MoralityStep = ({ characterId, onBack, onComplete }: MoralityStepProps) => {
  const { toast } = useToast();
  const { updateStatus } = useCharacterStatusUpdate();
  const [showQuestions, setShowQuestions] = useState(false);

  // Check if morality score exists (meaning questions were already answered)
  const { data: morality, isLoading } = useQuery({
    queryKey: ['morality-score', characterId],
    queryFn: async () => {
      const { data: responses } = await supabase
        .from('character_responses')
        .select('*')
        .eq('character_id', characterId);

      // If we have all 10 responses, show the score display
      if (responses && responses.length === 10) {
        const { data } = await supabase
          .from('character_morality')
          .select('*')
          .eq('character_id', characterId)
          .maybeSingle();

        return data;
      }

      return null;
    }
  });

  const handleBack = async () => {
    // If we're showing the score display and haven't clicked back yet
    if (morality && !showQuestions) {
      setShowQuestions(true);
      return;
    }

    try {
      const success = await updateStatus(characterId, 'clothing');
      if (success) {
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
      {morality && !showQuestions ? (
        <MoralityScoreDisplay
          characterId={characterId}
          onBack={handleBack}
          onContinue={onComplete}
        />
      ) : (
        <MoralityQuestions
          characterId={characterId}
          onBack={handleBack}
          onComplete={onComplete}
          startAtLastQuestion={!!morality}
        />
      )}
    </div>
  );
};