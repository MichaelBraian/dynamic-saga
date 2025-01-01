import { useMockCharacterState } from "./useMockCharacterState";
import { useMockHandlers } from "./useMockHandlers";

export const useMockCharacterCreation = () => {
  const {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
    updateState,
    setIsTransitioning
  } = useMockCharacterState();

  const {
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
  } = useMockHandlers(updateState, setIsTransitioning);

  const handleBack = async () => {
    if (isTransitioning) return;
    
    try {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStep = currentStep === 'gender' ? 'naming' 
        : currentStep === 'race' ? 'gender'
        : currentStep === 'animal_type' ? 'race'
        : currentStep === 'class' ? (selectedRace === 'Animal' ? 'animal_type' : 'race')
        : currentStep === 'clothing' ? 'class'
        : currentStep === 'armor' ? 'clothing'
        : currentStep === 'morality' ? 'armor'
        : currentStep === 'attributes' ? 'morality'
        : 'naming';

      updateState({
        currentStep: newStep,
        characterId: newStep === "naming" ? null : characterId,
      });
    } catch (error) {
      console.error('Error in mock navigation:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  return {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleBack,
  };
};