import { FaithPointsStep } from "@/components/character-creation/steps/FaithPointsStep";

interface FaithPointsStepRendererProps {
  characterId: string;
  onFaithPointsCompleted: () => void;
  onBack: () => void;
}

export const useFaithPointsStepRenderer = ({
  characterId,
  onFaithPointsCompleted,
  onBack,
}: FaithPointsStepRendererProps) => {
  const renderFaithPointsStep = () => {
    return (
      <FaithPointsStep
        characterId={characterId}
        onBack={onBack}
        onComplete={onFaithPointsCompleted}
      />
    );
  };

  return { renderFaithPointsStep };
}; 