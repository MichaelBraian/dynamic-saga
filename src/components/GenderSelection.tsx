import { CharacterSelectionScreen } from "./CharacterSelectionScreen";

interface GenderSelectionProps {
  characterId: string;
  onGenderSelected: () => void;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export const GenderSelection = ({ characterId, onGenderSelected }: GenderSelectionProps) => (
  <CharacterSelectionScreen
    title="Choose Gender"
    options={GENDER_OPTIONS}
    characterId={characterId}
    onSelected={onGenderSelected}
    updateField="gender"
    nextStatus="questioning"
  />
);