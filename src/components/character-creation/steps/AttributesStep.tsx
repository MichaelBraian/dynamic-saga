import { useAttributesManagement } from "@/hooks/useAttributesManagement";
import { AttributesHeader } from "./attributes/AttributesHeader";
import { AttributesList } from "./attributes/AttributesList";
import { ContinueButton } from "./attributes/ContinueButton";

interface AttributesStepProps {
  characterId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const AttributesStep = ({ characterId, onBack, onComplete }: AttributesStepProps) => {
  const {
    attributeRolls,
    isSaving,
    areAllAttributesRolled,
    handleRollComplete,
    handleContinue
  } = useAttributesManagement(characterId, onComplete);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
      <AttributesHeader onBack={onBack} />
      <AttributesList
        attributeRolls={attributeRolls}
        onRollComplete={handleRollComplete}
      />
      {areAllAttributesRolled() && (
        <ContinueButton
          onClick={handleContinue}
          disabled={isSaving}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};