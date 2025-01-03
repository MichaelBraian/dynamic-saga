import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";
import { Database } from "@/integrations/supabase/types";

type CharacterMorality = Database['public']['Tables']['character_morality']['Row'];
type CharacterMoralityInsert = Database['public']['Tables']['character_morality']['Insert'];
type CharacterResponse = Database['public']['Tables']['character_responses']['Row'];

export const useMoralityCalculation = (characterId: string) => {
  const { updateStatus } = useCharacterStatusUpdate();

  const calculateAndSaveMoralityScores = async (questions: MoralityQuestion[]) => {
    try {
      const { data: responses, error: responsesError } = await supabase
        .from('character_responses')
        .select('id, character_id, question_id, answer, created_at')
        .eq('character_id', characterId)
        .returns<CharacterResponse[]>();

      if (responsesError) throw responsesError;

      if (!questions || !responses) {
        throw new Error('Missing questions or responses data');
      }

      let goodEvilScore = 0;
      let lawfulChaoticScore = 0;
      
      questions.forEach((question, index) => {
        const response = responses.find(r => r.question_id === question.id);
        if (!response) return;

        const choiceNumber = parseInt(response.answer.split('.')[0]);
        if (isNaN(choiceNumber)) return;

        const normalizedScore = choiceNumber <= 2 ? 1 : -1;
        const weightedScore = question.morality_weight * normalizedScore;
        
        if (index % 2 === 0) {
          goodEvilScore += weightedScore;
        } else {
          lawfulChaoticScore += weightedScore;
        }
      });

      const maxPossibleScore = Math.floor(questions.length / 2) * Math.max(...questions.map(q => Math.abs(q.morality_weight)));
      const normalizedGoodEvil = Math.round((goodEvilScore / maxPossibleScore) * 100);
      const normalizedLawfulChaotic = Math.round((lawfulChaoticScore / maxPossibleScore) * 100);
      const boundedGoodEvil = Math.max(-100, Math.min(100, normalizedGoodEvil));
      const boundedLawfulChaotic = Math.max(-100, Math.min(100, normalizedLawfulChaotic));

      // Get the alignment ID based on the scores
      const { data: alignmentData, error: alignmentError } = await supabase
        .rpc('calculate_alignment', {
          p_good_evil: boundedGoodEvil,
          p_law_chaos: boundedLawfulChaotic
        })
        .single();

      if (alignmentError) throw alignmentError;

      const { data: alignmentId } = await supabase
        .from('morality_alignments')
        .select('id')
        .eq('moral_axis', alignmentData.moral_axis)
        .eq('ethical_axis', alignmentData.ethical_axis)
        .single();

      if (!alignmentId) {
        throw new Error('Could not find matching alignment');
      }

      const moralityData: CharacterMoralityInsert = {
        character_id: characterId,
        good_evil_points: boundedGoodEvil,
        law_chaos_points: boundedLawfulChaotic,
        alignment_id: alignmentId.id,
        alignment_justification: null
      };

      const { error: moralityError } = await supabase
        .from('character_morality')
        .upsert(moralityData, {
          onConflict: 'character_id'
        });

      if (moralityError) throw moralityError;

      await updateStatus(characterId, 'attributes');
      return true;
    } catch (error) {
      console.error('Error calculating morality scores:', error);
      throw error;
    }
  };

  return { calculateAndSaveMoralityScores };
};