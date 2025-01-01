import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";
import { ProgressBarWithIndicator } from "@/components/shared/ProgressBarWithIndicator";

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

  const getAlignmentDescription = (score: number) => {
    if (score >= 75) return "Angelic - You embody virtue and righteousness";
    if (score >= 50) return "Noble - You tend towards good and order";
    if (score >= 25) return "Moderate - You balance between light and dark";
    return "Devilish - You embrace darkness and chaos";
  };

  const getScaleDescription = (value: number, type: 'goodEvil' | 'lawfulChaotic') => {
    if (type === 'goodEvil') {
      if (value > 50) return "Strongly Good - You prioritize helping others";
      if (value > 0) return "Somewhat Good - You tend to do the right thing";
      if (value > -50) return "Somewhat Evil - You're willing to harm others for gain";
      return "Strongly Evil - You actively pursue destructive goals";
    } else {
      if (value > 50) return "Highly Lawful - You strictly follow rules and tradition";
      if (value > 0) return "Somewhat Lawful - You respect order but can be flexible";
      if (value > -50) return "Somewhat Chaotic - You follow your own path";
      return "Highly Chaotic - You reject all constraints and order";
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
      
      <div className="space-y-6 text-white">
        <div>
          <ProgressBarWithIndicator
            value={morality.alignment_score}
            leftLabel="Devil"
            rightLabel="Angel"
            description={getAlignmentDescription(morality.alignment_score)}
            height="lg"
          />
        </div>

        <div>
          <ProgressBarWithIndicator
            value={(morality.good_evil_scale + 100) / 2}
            leftLabel="Evil"
            rightLabel="Good"
            description={getScaleDescription(morality.good_evil_scale, 'goodEvil')}
            height="md"
          />
        </div>

        <div>
          <ProgressBarWithIndicator
            value={(morality.lawful_chaotic_scale + 100) / 2}
            leftLabel="Chaotic"
            rightLabel="Lawful"
            description={getScaleDescription(morality.lawful_chaotic_scale, 'lawfulChaotic')}
            height="md"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onClick={handleContinue}
          className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          Continue to Attributes <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};