import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface FaithPointsStepProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const FaithPointsStep = ({ characterId, onBack, onComplete }: FaithPointsStepProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [faithPoints, setFaithPoints] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing faith points
  const { data: existingFaithPoints, isLoading } = useQuery({
    queryKey: ['faith-points', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_attributes')
        .select('value')
        .eq('character_id', characterId)
        .eq('attribute_name', 'FTH')
        .single();

      if (error) {
        console.error('Error fetching faith points:', error);
        return null;
      }

      return data?.value || null;
    }
  });

  useEffect(() => {
    if (existingFaithPoints !== null) {
      setFaithPoints(existingFaithPoints);
      setHasRolled(true);
    }
  }, [existingFaithPoints]);

  const calculateFaithPoints = (roll: number) => {
    if (roll <= 2) return 1;
    if (roll <= 4) return 2;
    return 3;
  };

  const rollDice = async () => {
    // If faith points already exist, don't allow reroll
    if (existingFaithPoints !== null) {
      setFaithPoints(existingFaithPoints);
      setHasRolled(true);
      return;
    }

    setIsRolling(true);
    
    // Animate through random numbers
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setDiceResult(Math.floor(Math.random() * 6) + 1);
    }

    // Final result
    const finalRoll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(finalRoll);
    const points = calculateFaithPoints(finalRoll);
    setFaithPoints(points);
    setIsRolling(false);
    setHasRolled(true);

    // Save to database
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('character_attributes')
        .upsert(
          {
            character_id: characterId,
            attribute_name: 'FTH',
            value: points
          },
          {
            onConflict: 'character_id,attribute_name',
            ignoreDuplicates: false
          }
        );
      
      if (error) {
        console.error('Error saving faith points:', error);
        throw error;
      }
      
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving faith points:', error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="relative bg-black/60 backdrop-blur-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white text-center w-full flex items-center justify-center gap-2">
              Faith Points
              <InfoTooltip content="Faith Points represent your character's connection to divine power, granting them the ability to temporarily channel their deity's strength or blessings. Use Faith Points to activate divine abilities, such as powerful attacks, healing, or protective auras, providing a short-term boost in critical moments." />
            </h2>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {diceResult && !existingFaithPoints && (
              <div className={cn(
                "text-7xl font-bold transition-all duration-200",
                isRolling ? "animate-bounce text-yellow-400" : "text-white"
              )}>
                {diceResult}
              </div>
            )}

            {faithPoints && !isRolling && (
              <div className="text-center">
                <div className="text-2xl text-white mb-2">
                  Faith Points Awarded: <span className="text-yellow-400 font-bold">{faithPoints}</span>
                </div>
                {existingFaithPoints !== null && (
                  <div className="text-sm text-white/60">
                    (This roll is locked and cannot be changed)
                  </div>
                )}
              </div>
            )}

            {(!hasRolled || (!existingFaithPoints && !faithPoints)) && (
              <Button
                onClick={rollDice}
                disabled={isRolling || (hasRolled && existingFaithPoints !== null) || isSaving}
                className="w-full h-14 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                {isRolling ? "Rolling..." : "Roll for Faith Points"}
              </Button>
            )}

            {(hasRolled || existingFaithPoints !== null) && !isRolling && !isSaving && (
              <Button
                onClick={onComplete}
                className="w-full h-14 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 