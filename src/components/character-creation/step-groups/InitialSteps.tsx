import { GenderStep } from "../steps/GenderStep";
import { NameStep } from "../steps/NameStep";
import { RaceStep } from "../steps/RaceStep";
import { CharacterStatus } from "@/types/character";

interface InitialStepsProps {
  currentStep: CharacterStatus;
  characterId: string;
  onNameSelected: (newCharacterId: string) => void;
  onGenderSelected: () => void;
  onRaceSelected: () => Promise<void>;
  onBack: () => void;
}

export const InitialSteps = ({
  currentStep,
  characterId,
  onNameSelected,
  onGenderSelected,
  onRaceSelected,
  onBack,
}: InitialStepsProps) => {
  if (currentStep === "naming") {
    return <NameStep onNameSelected={onNameSelected} />;
  }

  switch (currentStep) {
    case "gender":
      return (
        <GenderStep 
          characterId={characterId}
          onGenderSelected={onGenderSelected}
          onBack={onBack}
        />
      );
    case "race":
      return (
        <RaceStep 
          characterId={characterId}
          onRaceSelected={onRaceSelected}
          onBack={onBack}
        />
      );
    default:
      return null;
  }
};