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
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl px-4">
        <div className="relative bg-black/60 backdrop-blur-md rounded-lg p-6">
          <div className="relative z-10">
            <AttributesHeader onBack={onBack} />
          </div>
          <div className="relative z-0">
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
        </div>
      </div>
    </div>
  );
};