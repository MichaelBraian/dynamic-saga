import { ClassSelection } from "../../ClassSelection";

interface ClassStepProps {
  characterId: string;
  onBack: () => void;
  onClassSelected: (characterClass: string) => void;
}

export const ClassStep = ({ characterId, onBack, onClassSelected }: ClassStepProps) => (
  <div className="animate-fade-in">
    <ClassSelection 
      characterId={characterId}
      onBack={onBack}
      onClassSelected={onClassSelected}
    />
  </div>
);