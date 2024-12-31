import { GenderSelection } from "../../GenderSelection";

interface GenderStepProps {
  characterId: string;
  onGenderSelected: () => void;
  onBack: () => void;
}

export const GenderStep = ({ characterId, onGenderSelected, onBack }: GenderStepProps) => (
  <div className="animate-fade-in">
    <GenderSelection 
      characterId={characterId} 
      onGenderSelected={onGenderSelected}
      onBack={onBack}
    />
  </div>
);