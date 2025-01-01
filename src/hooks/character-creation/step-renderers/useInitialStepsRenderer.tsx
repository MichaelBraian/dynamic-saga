import { CharacterStatus } from "@/types/character";
import { InitialSteps } from "@/components/character-creation/step-groups/InitialSteps";

interface InitialStepsRendererProps {
  currentStep: CharacterStatus;
  characterId: string;
  onNameSelected: (newCharacterId: string) => void;
  onGenderSelected: () => void;
  onRaceSelected: () => Promise<void>;
  onBack: () => void;
}

export const useInitialStepsRenderer = ({
  currentStep,
  characterId,
  onNameSelected,
  onGenderSelected,
  onRaceSelected,
  onBack,
}: InitialStepsRendererProps) => {
  const renderInitialSteps = () => (
    <InitialSteps
      currentStep={currentStep}
      characterId={characterId}
      onNameSelected={onNameSelected}
      onGenderSelected={onGenderSelected}
      onRaceSelected={onRaceSelected}
      onBack={onBack}
    />
  );

  return { renderInitialSteps };
};