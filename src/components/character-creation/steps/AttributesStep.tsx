import { useAttributesManagement } from "@/hooks/useAttributesManagement";
import { AttributesHeader } from "./attributes/AttributesHeader";
import { AttributesList } from "./attributes/AttributesList";
import { ContinueButton } from "./attributes/ContinueButton";

interface AttributesStepProps {
  characterId: string;
  onBack: () => void;
}

export const AttributesStep = ({ characterId, onBack }: AttributesStepProps) => {
  const {
    attributeRolls,
    isSaving,
    allAttributesRolled,
    handleRollComplete,
    handleBack,
    handleContinue
  } = useAttributesManagement(characterId);

  const handleBackClick = async () => {
    const success = await handleBack();
    if (success) {
      onBack();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg animate-fade-in">
      <AttributesHeader onBack={handleBackClick} />
      <AttributesList
        attributeRolls={attributeRolls}
        onRollComplete={handleRollComplete}
      />
      {allAttributesRolled && (
        <ContinueButton
          onClick={handleContinue}
          disabled={isSaving}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};