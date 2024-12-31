import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MoralityScoreDisplayProps {
  characterId: string;
}

export const MoralityScoreDisplay = ({ characterId }: MoralityScoreDisplayProps) => {
  const { data: morality } = useQuery({
    queryKey: ['morality-score', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_morality')
        .select('alignment_score')
        .eq('character_id', characterId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
      <h2 className="text-2xl font-['Cinzel'] text-white text-center mb-6">Your Morality Score</h2>
      <div className="relative mb-2">
        <Progress value={morality?.alignment_score ?? 0} className="h-8" />
        <div className="flex justify-between mt-2 text-white font-['Cinzel']">
          <span>Angel</span>
          <span>Devil</span>
        </div>
      </div>
      <p className="text-white text-center mt-4">
        Your alignment score: {morality?.alignment_score ?? 0}
      </p>
    </div>
  );
};