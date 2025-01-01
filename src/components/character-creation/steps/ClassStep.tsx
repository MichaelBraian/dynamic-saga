import { ClassSelection } from "../../ClassSelection";

interface ClassStepProps {
  characterId: string;
  onBack: () => void;
  onClassSelected: (characterClass: string) => void;
}

export const ClassStep = ({ characterId, onBack, onClassSelected }: ClassStepProps) => {
  const handleClassSelected = async (characterClass: string) => {
    try {
      await onClassSelected(characterClass);
    } catch (error) {
      console.error('Error in class selection:', error);
      throw error; // Re-throw to be handled by the ClassSelection component
    }
  };

  return (
    <div className="animate-fade-in">
      <ClassSelection 
        characterId={characterId}
        onBack={onBack}
        onClassSelected={handleClassSelected}
      />
    </div>
  );
};