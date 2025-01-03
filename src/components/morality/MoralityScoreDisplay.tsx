import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityLoadingState } from "./score-display/MoralityLoadingState";
import { ScoresDisplay } from "./score-display/ScoresDisplay";
import { ContinueButton } from "./score-display/ContinueButton";
import { useToast } from "@/hooks/use-toast";
import { SelectionHeader } from "../character-selection/SelectionHeader";
import { Database } from "@/integrations/supabase/types";

interface MoralityScoreDisplayProps {
  characterId: string;
  onContinue: () => void;
}

type CharacterMorality = Database['public']['Tables']['character_morality']['Row'];
type MoralityAlignment = Database['public']['Tables']['morality_alignments']['Row'];

const calculateAlignmentScore = (goodEvil: number, lawChaos: number): number => {
  // Convert from -100 to 100 scale to 0 to 100 scale
  const normalizedGoodEvil = (goodEvil + 100) / 2;
  const normalizedLawChaos = (lawChaos + 100) / 2;
  
  // Weight both axes equally
  return Math.round((normalizedGoodEvil + normalizedLawChaos) / 2);
};

export const MoralityScoreDisplay = ({ characterId, onContinue }: MoralityScoreDisplayProps) => {
  const { toast } = useToast();
  
  const { data: morality, isLoading: isMoralityLoading, error: moralityError } = useQuery<CharacterMorality>({
    queryKey: ['morality-score', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_morality')
        .select('*')
        .eq('character_id', characterId)
        .single();

      if (error) {
        console.error('Error fetching morality score:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No morality score found');
      }

      return data;
    },
  });

  const { data: alignment, isLoading: isAlignmentLoading } = useQuery<MoralityAlignment>({
    queryKey: ['alignment', morality?.alignment_id],
    enabled: !!morality?.alignment_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('morality_alignments')
        .select('*')
        .eq('id', morality!.alignment_id)
        .single();

      if (error) {
        console.error('Error fetching alignment details:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No alignment details found');
      }

      return data;
    },
  });

  if (moralityError) {
    console.error('Error loading morality score:', moralityError);
    toast({
      variant: "destructive",
      description: "Failed to load morality score. Please try again.",
    });
    return <MoralityLoadingState message="Error loading score" />;
  }

  if (isMoralityLoading || isAlignmentLoading || !morality || !alignment) {
    return <MoralityLoadingState message="Loading your morality score..." />;
  }

  const alignmentScore = calculateAlignmentScore(
    morality.good_evil_points,
    morality.law_chaos_points
  );

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <SelectionHeader 
        title="Your Morality Score"
        showBackButton={false}
      />
      
      <ScoresDisplay 
        alignmentScore={alignmentScore}
        goodEvilScale={morality.good_evil_points}
        lawfulChaoticScale={morality.law_chaos_points}
      />

      <div className="mt-8 space-y-4 text-white">
        <div>
          <h3 className="text-xl font-['Cinzel'] mb-2">Alignment: {alignment.name}</h3>
          <p className="text-white/80 font-['IM_Fell_English']">{alignment.description}</p>
        </div>
        {alignment.effects && (
          <div>
            <h4 className="text-lg font-['Cinzel'] mb-2">Effects</h4>
            <div className="bg-white/10 rounded-lg p-4">
              <pre className="whitespace-pre-wrap font-['IM_Fell_English'] text-white/80">
                {JSON.stringify(alignment.effects, null, 2)}
              </pre>
            </div>
          </div>
        )}
        {morality.alignment_justification && (
          <div>
            <h4 className="text-lg font-['Cinzel'] mb-2">Justification</h4>
            <p className="text-white/80 font-['IM_Fell_English']">{morality.alignment_justification}</p>
          </div>
        )}
      </div>

      <ContinueButton onClick={onContinue} />
    </div>
  );
};