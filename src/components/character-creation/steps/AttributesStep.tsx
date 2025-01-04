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
    <div className="fixed inset-0 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {areAllAttributesRolled() && (
        <div className="sticky bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent py-4 px-4">
          <div className="max-w-2xl mx-auto">
            <ContinueButton
              onClick={handleContinue}
              disabled={isSaving}
              isSaving={isSaving}
            />
          </div>
        </div>
      )}
    </div>
  );
};