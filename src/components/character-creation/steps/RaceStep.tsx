import { RaceSelection } from "../../RaceSelection";
import { ErrorBoundary } from "../../shared/ErrorBoundary";

interface RaceStepProps {
  characterId: string;
  onRaceSelected: () => Promise<void>;
  onBack: () => void;
}

export const RaceStep = ({ characterId, onRaceSelected, onBack }: RaceStepProps) => (
  <ErrorBoundary>
    <div className="animate-fade-in">
      <RaceSelection 
        characterId={characterId} 
        onRaceSelected={onRaceSelected}
        onBack={onBack}
      />
    </div>
  </ErrorBoundary>
);