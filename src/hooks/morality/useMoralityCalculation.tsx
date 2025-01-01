import { supabase } from "@/integrations/supabase/client";
import { MoralityQuestion } from "@/types/morality";
import { useCharacterStatusUpdate } from "@/utils/characterStatus";

export const useMoralityCalculation = (characterId: string) => {
  const { updateStatus } = useCharacterStatusUpdate();

  const calculateAndSaveMoralityScores = async (questions: MoralityQuestion[]) => {
    try {
      const { data: responses, error: responsesError } = await supabase
        .from('character_responses')
        .select('question_id, answer')
        .eq('character_id', characterId);

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
      const alignmentScore = Math.round((Math.abs(boundedGoodEvil) + Math.abs(boundedLawfulChaotic)) / 2);

      const { error: moralityError } = await supabase
        .from('character_morality')
        .upsert({
          character_id: characterId,
          good_evil_scale: boundedGoodEvil,
          lawful_chaotic_scale: boundedLawfulChaotic,
          alignment_score: alignmentScore
        }, {
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