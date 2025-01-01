import { SpecialtyStep } from "@/components/character-creation/steps/SpecialtyStep";

interface SpecialtyStepRendererProps {
  characterId: string;
  selectedClass: string | null;
  onSpecialtySelected: () => void;
  onBack: () => void;
}

export const useSpecialtyStepRenderer = ({
  characterId,
  selectedClass,
  onSpecialtySelected,
  onBack,
}: SpecialtyStepRendererProps) => {
  const renderSpecialtyStep = () => (
    <SpecialtyStep
      characterId={characterId}
      onBack={onBack}
      onComplete={onSpecialtySelected}
    />
  );

  return { renderSpecialtyStep };
};