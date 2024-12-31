import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useNavigate } from "react-router-dom";

interface RaceSelectionProps {
  characterId: string;
}

const RACE_OPTIONS = [
  { value: 'Human', label: 'Human' },
  { value: 'Dwarf', label: 'Dwarf' },
  { value: 'Animal', label: 'Animal' }
];

export const RaceSelection = ({ characterId }: RaceSelectionProps) => {
  const navigate = useNavigate();

  return (
    <CharacterSelectionScreen
      title="Choose Race"
      options={RACE_OPTIONS}
      characterId={characterId}
      onSelected={() => navigate("/")}
      updateField="race"
      nextStatus="attributes"
    />
  );
};