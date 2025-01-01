import { MoralityStep } from "../steps/MoralityStep";
import { AttributesStep } from "../steps/AttributesStep";
import { CharacterStatus } from "@/types/character";

interface FinalStepsProps {
  currentStep: CharacterStatus;
  characterId: string;
  onMoralityCompleted: () => void;
  onAttributesCompleted: () => void;
  onBack: () => void;
}

export const FinalSteps = ({
  currentStep,
  characterId,
  onMoralityCompleted,
  onAttributesCompleted,
  onBack,
}: FinalStepsProps) => {
  switch (currentStep) {
    case "morality":
      return (
        <MoralityStep
          characterId={characterId}
          onBack={onBack}
          onComplete={onMoralityCompleted}
        />
      );
    case "attributes":
      return (
        <AttributesStep
          characterId={characterId}
          onBack={onBack}
          onComplete={onAttributesCompleted}
        />
      );
    default:
      return null;
  }
};