import { BaseSelectionForm } from "./shared/BaseSelectionForm";

interface GenderSelectionProps {
  characterId: string;
  onGenderSelected: () => void;
  onBack: () => void;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export const GenderSelection = ({ characterId, onGenderSelected, onBack }: GenderSelectionProps) => (
  <BaseSelectionForm
    title="Choose Gender"
    options={GENDER_OPTIONS}
    characterId={characterId}
    onSelected={onGenderSelected}
    onBack={onBack}
    updateField="gender"
    nextStatus="race"
  />
);