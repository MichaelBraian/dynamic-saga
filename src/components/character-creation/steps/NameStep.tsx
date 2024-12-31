import { NameSelection } from "../../NameSelection";

interface NameStepProps {
  onNameSelected: (newCharacterId: string) => void;
}

export const NameStep = ({ onNameSelected }: NameStepProps) => (
  <div className="animate-fade-in">
    <NameSelection onNameSelected={onNameSelected} />
  </div>
);