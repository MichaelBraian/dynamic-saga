import { useCharacterCreation } from '@/store/useCharacterCreation';
import { NameSelection } from './steps/NameSelection';
import { GenderSelection } from './steps/GenderSelection';
import { Button } from '@radix-ui/themes';

const steps = {
  name: NameSelection,
  gender: GenderSelection,
  race: () => <div>Race Selection (Coming Soon)</div>,
  animalType: () => <div>Animal Type Selection (Coming Soon)</div>,
  class: () => <div>Class Selection (Coming Soon)</div>,
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
  const { currentStep, setStep } = useCharacterCreation();
  const CurrentStepComponent = steps[currentStep];

  const handleNext = () => {
    const stepKeys = Object.keys(steps) as Array<keyof typeof steps>;
    const currentIndex = stepKeys.indexOf(currentStep);
    if (currentIndex < stepKeys.length - 1) {
      setStep(stepKeys[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepKeys = Object.keys(steps) as Array<keyof typeof steps>;
    const currentIndex = stepKeys.indexOf(currentStep);
    if (currentIndex > 0) {
      setStep(stepKeys[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Character Creation</h1>
        <div className="text-sm text-gray-500">
          Step {Object.keys(steps).indexOf(currentStep) + 1} of {Object.keys(steps).length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <CurrentStepComponent />
      </div>

      <div className="flex justify-between">
        <Button
          variant="soft"
          onClick={handlePrevious}
          disabled={currentStep === 'name'}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === 'generated'}
        >
          {currentStep === 'complete' ? 'Generate Image' : 'Next'}
        </Button>
      </div>
    </div>
  );
} 