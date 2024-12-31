import { ArmorSelection } from "../../ArmorSelection";

interface ArmorStepProps {
  characterId: string;
  selectedClass: string;
  onBack: () => void;
  onArmorSelected: () => void;
}

export const ArmorStep = ({ characterId, selectedClass, onBack, onArmorSelected }: ArmorStepProps) => (
  <div className="animate-fade-in">
    <ArmorSelection
      characterId={characterId}
      characterClass={selectedClass}
      onBack={onBack}
      onArmorSelected={onArmorSelected}
    />
  </div>
);