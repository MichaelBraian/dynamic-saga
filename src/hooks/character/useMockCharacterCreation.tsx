import { useMockState } from "./mock/useMockState";
import { useMockHandlers } from "./mock/useMockHandlers";
import { useMockNavigation } from "./mock/useMockNavigation";

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
  } = useMockState();

  const {
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
  } = useMockHandlers(updateState, setIsTransitioning);

  const { handleBack } = useMockNavigation(updateState, setIsTransitioning);

  return {
    // State
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
    
    // Handlers
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleBack,
  };
};