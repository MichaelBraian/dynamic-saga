import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface MoralityScoreDisplayProps {
  characterId: string;
  onContinue: () => void;
}

export const MoralityScoreDisplay = ({ characterId, onContinue }: MoralityScoreDisplayProps) => {
  const { data: morality, isLoading } = useQuery({
    queryKey: ['morality-score', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_morality')
        .select('alignment_score, good_evil_scale, lawful_chaotic_scale')
        .eq('character_id', characterId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <h2 className="text-2xl font-['Cinzel'] text-white text-center mb-6">Loading your morality score...</h2>
      </div>
    );
  }

  if (!morality) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <h2 className="text-2xl font-['Cinzel'] text-white text-center mb-6">Score not available</h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
      <h2 className="text-2xl font-['Cinzel'] text-white text-center mb-6">Your Morality Score</h2>
      <div className="relative mb-6">
        <Progress value={morality.alignment_score} className="h-8" />
        <div className="flex justify-between mt-2 text-white font-['Cinzel']">
          <span>Angel</span>
          <span>Devil</span>
        </div>
      </div>
      <div className="space-y-4 text-white text-center">
        <p className="text-lg">Alignment Score: {morality.alignment_score}</p>
        <p>Good/Evil Scale: {morality.good_evil_scale}</p>
        <p>Lawful/Chaotic Scale: {morality.lawful_chaotic_scale}</p>
      </div>
      <div className="flex justify-center mt-6">
        <Button
          onClick={onContinue}
          className="bg-white/10 text-white hover:bg-white/20"
        >
          Continue to Attributes <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};