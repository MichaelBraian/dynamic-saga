import { MoralityQuestions } from "../../MoralityQuestions";
import { supabase } from "@/integrations/supabase/client";

interface MoralityStepProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityStep = ({ characterId, onBack }: MoralityStepProps) => {
  const handleContinue = async () => {
    await supabase
      .from('characters')
      .update({ status: 'attributes' })
      .eq('id', characterId);
  };

  return (
    <div className="animate-fade-in">
      <MoralityQuestions
        characterId={characterId}
        onBack={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
};