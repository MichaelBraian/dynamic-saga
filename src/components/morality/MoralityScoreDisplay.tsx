import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";
import { AlignmentScore } from "./score-display/AlignmentScore";
import { MoralityScale } from "./score-display/MoralityScale";

interface MoralityScoreDisplayProps {
  characterId: string;
  onContinue: () => void;
}

export const MoralityScoreDisplay = ({ characterId, onContinue }: MoralityScoreDisplayProps) => {
  const { updateStatus } = useCharacterStatusUpdate();

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

  const handleContinue = async () => {
    const success = await updateStatus(characterId, 'attributes');
    if (success) {
      onContinue();
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <h2 className="text-2xl font-['IM_Fell_English'] text-white text-center mb-6">Error loading score</h2>
        <p className="text-white text-center">Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <h2 className="text-2xl font-['IM_Fell_English'] text-white text-center mb-6">Loading your morality score...</h2>
      </div>
    );
  }

  if (!morality) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <h2 className="text-2xl font-['IM_Fell_English'] text-white text-center mb-6">Score not available</h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
      <h2 className="text-2xl font-['IM_Fell_English'] text-white text-center mb-6">Your Morality Score</h2>
      
      <div className="space-y-8 text-white">
        <div>
          <AlignmentScore score={morality.alignment_score} />
        </div>

        <div>
          <MoralityScale 
            value={morality.good_evil_scale} 
            type="goodEvil" 
          />
        </div>

        <div>
          <MoralityScale 
            value={morality.lawful_chaotic_scale} 
            type="lawfulChaotic" 
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleContinue}
          className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-lg py-6 px-8 shadow-lg"
        >
          Continue to Attributes <ArrowRight className="ml-2 w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};