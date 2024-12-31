import { CharacterSelectionScreen } from "./CharacterSelectionScreen";

interface RaceSelectionProps {
  characterId: string;
  onRaceSelected: () => void;
  onBack: () => void;
}

const RACE_OPTIONS = [
  { value: 'Human', label: 'Human' },
  { value: 'Dwarf', label: 'Dwarf' },
  { value: 'Animal', label: 'Animal' }
];

export const RaceSelection = ({ characterId, onRaceSelected, onBack }: RaceSelectionProps) => {
  return (
    <CharacterSelectionScreen
      title="Choose Race"
      options={RACE_OPTIONS}
      characterId={characterId}
      onSelected={onRaceSelected}
      onBack={onBack}
      updateField="race"
      nextStatus="class"
    />
  );
};