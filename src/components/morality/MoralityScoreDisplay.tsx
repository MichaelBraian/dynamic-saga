import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MoralityLoadingState } from "./score-display/MoralityLoadingState";
import { ScoresDisplay } from "./score-display/ScoresDisplay";
import { ContinueButton } from "./score-display/ContinueButton";
import { useToast } from "@/hooks/use-toast";
import { SelectionHeader } from "../character-selection/SelectionHeader";
import { Database } from "@/integrations/supabase/types";
import { useEffect } from "react";
import { Query } from "@tanstack/react-query";

interface MoralityScoreDisplayProps {
  characterId: string;
  onContinue: () => void;
  onBack: () => void;
}

type CharacterMorality = Database['public']['Tables']['character_morality']['Row'];

const getAlignmentName = (goodEvil: number, lawChaos: number): string => {
  const moralAxis = goodEvil >= 33 ? 'good' : goodEvil <= -33 ? 'evil' : 'neutral';
  const ethicalAxis = lawChaos >= 33 ? 'lawful' : lawChaos <= -33 ? 'chaotic' : 'neutral';
  
  if (moralAxis === 'neutral' && ethicalAxis === 'neutral') {
    return 'True Neutral';
  }
  
  if (moralAxis === 'neutral') {
    return `${ethicalAxis.charAt(0).toUpperCase() + ethicalAxis.slice(1)} Neutral`;
  }
  
  if (ethicalAxis === 'neutral') {
    return `Neutral ${moralAxis.charAt(0).toUpperCase() + moralAxis.slice(1)}`;
  }
  
  return `${ethicalAxis.charAt(0).toUpperCase() + ethicalAxis.slice(1)} ${moralAxis.charAt(0).toUpperCase() + moralAxis.slice(1)}`;
};

const getAlignmentEffects = (alignmentName: string): string => {
  switch (alignmentName) {
    case 'Lawful Good':
      return "You are a noble champion of justice and order, guided by strong moral principles.";
    case 'Neutral Good':
      return "You strive to help others and do what's right, without being bound by rules.";
    case 'Chaotic Good':
      return "You follow your heart and fight for what's right, regardless of laws or traditions.";
    case 'Lawful Neutral':
      return "You believe in order and structure above all else, following rules without moral judgment.";
    case 'True Neutral':
      return "You maintain balance between extremes, acting pragmatically based on circumstances.";
    case 'Chaotic Neutral':
      return "You value personal freedom above all, avoiding both moral extremes and societal constraints.";
    case 'Lawful Evil':
      return "You use structure and order to achieve your goals, regardless of who gets hurt.";
    case 'Neutral Evil':
      return "You act purely in self-interest, hurting others without remorse when it benefits you.";
    case 'Chaotic Evil':
      return "You revel in destruction and discord, following your darkest impulses.";
    default:
      return "Your actions shape your destiny.";
  }
};

export const MoralityScoreDisplay = ({ characterId, onContinue, onBack }: MoralityScoreDisplayProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: morality, isLoading: isMoralityLoading, error: moralityError, refetch } = useQuery<CharacterMorality>({
    queryKey: ['morality-score', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_morality')
        .select('*')
        .eq('character_id', characterId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching morality score:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No morality score found');
      }

      return data;
    },
    retry: 3,
    retryDelay: 1000,
    refetchInterval: (query: Query<CharacterMorality, Error>) => {
      // If we have data, stop polling
      if (query.state.data) return false;
      // If we've retried 3 times, stop polling
      if (query.state.dataUpdatedAt && Date.now() - query.state.dataUpdatedAt > 10000) return false;
      // Otherwise, poll every 2 seconds
      return 2000;
    }
  });

  useEffect(() => {
    if (moralityError) {
      console.error('Error loading morality score:', moralityError);
      toast({
        variant: "destructive",
        description: "Failed to load morality score. Retrying...",
      });
      
      // Retry after a delay
      const timer = setTimeout(() => {
        refetch();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [moralityError, refetch, toast]);

  const handleBack = () => {
    // Invalidate the morality score query before going back
    queryClient.invalidateQueries({ queryKey: ['morality-score', characterId] });
    onBack();
  };

  if (isMoralityLoading) {
    return <MoralityLoadingState message="Calculating your morality score..." />;
  }

  if (moralityError || !morality) {
    return <MoralityLoadingState message="Retrying score calculation..." />;
  }

  const alignmentName = getAlignmentName(morality.good_evil_scale, morality.lawful_chaotic_scale);

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <SelectionHeader 
        title="Your Morality Score"
        onBack={handleBack}
        showBackButton={true}
      />
      
      <ScoresDisplay 
        alignmentScore={morality.alignment_score}
        goodEvilScale={morality.good_evil_scale}
        lawfulChaoticScale={morality.lawful_chaotic_scale}
      />

      <div className="mt-8 space-y-4 text-white">
        <div>
          <h3 className="text-xl font-['Cinzel'] mb-2">Alignment: {alignmentName}</h3>
          <p className="text-white/80 font-['IM_Fell_English']">{getAlignmentEffects(alignmentName)}</p>
        </div>
      </div>

      <ContinueButton onClick={onContinue} />
    </div>
  );
};