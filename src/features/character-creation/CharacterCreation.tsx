import { useCharacterCreation } from '@/store/useCharacterCreation';
import { NameSelection } from './steps/NameSelection';
import { GenderSelection } from './steps/GenderSelection';
import { RaceSelection } from './steps/RaceSelection';
import { AnimalTypeSelection } from './steps/AnimalTypeSelection';
import { ClassSelection } from './steps/ClassSelection';
import { Button } from '@radix-ui/themes';

const steps = {
  name: NameSelection,
  gender: GenderSelection,
  race: RaceSelection,
  animalType: AnimalTypeSelection,
  class: ClassSelection,
  attributes: () => <div>Attributes Assignment (Coming Soon)</div>,
  morality: () => <div>Morality System (Coming Soon)</div>,
  faith: () => <div>Faith Selection (Coming Soon)</div>,
  faithPoints: () => <div>Faith Points Distribution (Coming Soon)</div>,
  specialties: () => <div>Specialties Selection (Coming Soon)</div>,
  background: () => <div>Background Creation (Coming Soon)</div>,
  appearance: () => <div>Appearance Customization (Coming Soon)</div>,
  clothing: () => <div>Clothing Selection (Coming Soon)</div>,
  equipment: () => <div>Equipment Selection (Coming Soon)</div>,
  description: () => <div>AI Description Generation (Coming Soon)</div>,
  characterCard: () => <div>Character Card Preview (Coming Soon)</div>,
  complete: () => <div>Character Review & Completion (Coming Soon)</div>,
  generated: () => <div>AI Image Generation (Coming Soon)</div>,
} as const;

export function CharacterCreation() {
  const { currentStep, goToNextStep, goToPreviousStep, canGoBack, canGoForward } = useCharacterCreation();
  const StepComponent = steps[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <StepComponent />
      </div>

      <div className="flex justify-between">
        <Button
          variant="soft"
          onClick={goToPreviousStep}
          disabled={!canGoBack}
        >
          Previous
        </Button>
        <Button
          onClick={goToNextStep}
          disabled={!canGoForward}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 