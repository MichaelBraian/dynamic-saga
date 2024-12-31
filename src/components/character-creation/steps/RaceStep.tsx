import { RaceSelection } from "../../RaceSelection";

interface RaceStepProps {
  characterId: string;
  onRaceSelected: () => Promise<void>;
  onBack: () => void;
}

export const RaceStep = ({ characterId, onRaceSelected, onBack }: RaceStepProps) => (
  <div className="animate-fade-in">
    <RaceSelection 
      characterId={characterId} 
      onRaceSelected={onRaceSelected}
      onBack={onBack}
    />
  </div>
);