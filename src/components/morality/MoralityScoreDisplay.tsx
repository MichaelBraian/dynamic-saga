import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityLoadingState } from "./score-display/MoralityLoadingState";
import { ScoresDisplay } from "./score-display/ScoresDisplay";
import { ContinueButton } from "./score-display/ContinueButton";

interface MoralityScoreDisplayProps {
  characterId: string;
  onContinue: () => void;
}

export const MoralityScoreDisplay = ({ characterId, onContinue }: MoralityScoreDisplayProps) => {
  const { data: morality, isLoading, error } = useQuery({
    queryKey: ['morality-score', characterId],
    queryFn: async () => {
      console.log('Fetching morality score for character:', characterId);
      const { data, error } = await supabase
        .from('character_morality')
        .select('alignment_score, good_evil_scale, lawful_chaotic_scale')
        .eq('character_id', characterId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching morality score:', error);
        throw error;
      }

      if (!data) {
        console.error('No morality score found for character:', characterId);
        throw new Error('No morality score found');
      }

      console.log('Retrieved morality score:', data);
      return data;
    },
  });

  if (error) {
    return <MoralityLoadingState message="Error loading score" />;
  }

  if (isLoading) {
    return <MoralityLoadingState message="Loading your morality score..." />;
  }

  if (!morality) {
    return <MoralityLoadingState message="Score not available" />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
      <h2 className="text-2xl font-['Cinzel'] text-white text-center mb-6">Your Morality Score</h2>
      
      <ScoresDisplay 
        alignmentScore={morality.alignment_score}
        goodEvilScale={morality.good_evil_scale}
        lawfulChaoticScale={morality.lawful_chaotic_scale}
      />

      <ContinueButton onClick={onContinue} />
    </div>
  );
};