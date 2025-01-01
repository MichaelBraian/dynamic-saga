import { CharacterStatus } from "@/types/character";
import { FinalSteps } from "@/components/character-creation/step-groups/FinalSteps";

interface FinalStepsRendererProps {
  currentStep: CharacterStatus;
  characterId: string;
  onMoralityCompleted: () => void;
  onAttributesCompleted: () => void;
  onBack: () => void;
}

export const useFinalStepsRenderer = ({
  currentStep,
  characterId,
  onMoralityCompleted,
  onAttributesCompleted,
  onBack,
}: FinalStepsRendererProps) => {
  const renderFinalSteps = () => (
    <FinalSteps
      currentStep={currentStep}
      characterId={characterId}
      onMoralityCompleted={onMoralityCompleted}
      onAttributesCompleted={onAttributesCompleted}
      onBack={onBack}
    />
  );

  return { renderFinalSteps };
};