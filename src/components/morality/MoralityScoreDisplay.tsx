import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SelectionHeader } from "../character-selection/SelectionHeader";
import { MoralityDisplay } from "../shared/morality/MoralityDisplay";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface MoralityScoreDisplayProps {
  characterId: string;
  onContinue: () => void;
  onBack: () => void;
}

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

  const { data: morality, isLoading } = useQuery({
    queryKey: ['morality-score', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_morality')
        .select('*')
        .eq('character_id', characterId)
        .single();

      if (error) {
        console.error('Error fetching morality score:', error);
        toast({
          variant: "destructive",
          description: "Failed to load morality score. Please try again.",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <h2 className="text-2xl font-['IM_Fell_English'] text-white text-center mb-6">
          Calculating your morality score...
        </h2>
      </div>
    );
  }

  if (!morality) {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <h2 className="text-2xl font-['IM_Fell_English'] text-white text-center mb-6">
          Failed to load morality score
        </h2>
      </div>
    );
  }

  const alignmentName = getAlignmentName(morality.good_evil_scale, morality.lawful_chaotic_scale);

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <SelectionHeader 
        title="Your Morality Score"
        onBack={onBack}
        showBackButton={true}
      />
      
      <MoralityDisplay 
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

      <div className="mt-8">
        <Button
          onClick={onContinue}
          className="w-full bg-white/10 hover:bg-white/20 text-white"
        >
          Continue to Attributes <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 