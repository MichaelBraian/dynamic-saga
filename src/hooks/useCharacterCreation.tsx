import { useCharacterStateManagement } from "./character/useCharacterStateManagement";
import { useCharacterSubscription } from "./character/useCharacterSubscription";
import { useCharacterVerification } from "./character/useCharacterVerification";
import { useCharacterSteps } from "./character/useCharacterSteps";
import { useCharacterSelectionHandlers } from "./character/useCharacterSelectionHandlers";

export const useCharacterCreation = () => {
  const {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
    setIsTransitioning,
    updateCharacterState,
    toast
  } = useCharacterStateManagement();

  const { verifyCharacter } = useCharacterVerification();
  const { handleBack: handleStepBack } = useCharacterSteps();

  useCharacterSubscription(characterId, updateCharacterState);

  const {
    handleNameSelected: handleNameSelectedBase,
    handleGenderSelected: handleGenderSelectedBase,
    handleRaceSelected: handleRaceSelectedBase,
    handleAnimalTypeSelected: handleAnimalTypeSelectedBase,
    handleClassSelected: handleClassSelectedBase,
    handleClothingSelected: handleClothingSelectedBase,
    handleArmorSelected: handleArmorSelectedBase
  } = useCharacterSelectionHandlers();

  const handleBack = async () => {
    if (isTransitioning || !characterId) {
      console.log('Cannot go back: transitioning or no character ID');
      return;
    }

    try {
      setIsTransitioning(true);
      await handleStepBack(
        isTransitioning,
        characterId,
        currentStep,
        selectedRace,
        selectedAnimalType,
        selectedClass
      );
    } catch (error) {
      console.error('Error handling back navigation:', error);
      toast({
        variant: "destructive",
        description: "Failed to go back. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleNameSelected = async (newCharacterId: string) => {
    try {
      setIsTransitioning(true);
      await handleNameSelectedBase(newCharacterId);
      await verifyCharacter(newCharacterId);
      updateCharacterState({
        characterId: newCharacterId,
        currentStep: 'gender'
      });
    } catch (error) {
      console.error('Error in name selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to create character. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleGenderSelected = async () => {
    if (!characterId) return;
    try {
      setIsTransitioning(true);
      await verifyCharacter(characterId);
      await handleGenderSelectedBase(characterId);
      updateCharacterState({ currentStep: 'race' });
    } catch (error) {
      console.error('Error in gender selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save gender. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleRaceSelected = async () => {
    if (!characterId) return;
    try {
      setIsTransitioning(true);
      await verifyCharacter(characterId);
      await handleRaceSelectedBase(characterId);
    } catch (error) {
      console.error('Error in race selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save race. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleAnimalTypeSelected = async (animalType: string) => {
    if (!characterId) return;
    try {
      setIsTransitioning(true);
      await verifyCharacter(characterId);
      await handleAnimalTypeSelectedBase(animalType, characterId);
      updateCharacterState({ selectedAnimalType: animalType });
    } catch (error) {
      console.error('Error in animal type selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save animal type. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClassSelected = async (characterClass: string) => {
    if (!characterId || !selectedRace) return;
    try {
      setIsTransitioning(true);
      await verifyCharacter(characterId);
      await handleClassSelectedBase(characterClass, characterId);
      updateCharacterState({ selectedClass: characterClass });
    } catch (error) {
      console.error('Error in class selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save class. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClothingSelected = async () => {
    if (!characterId) return;
    try {
      setIsTransitioning(true);
      await verifyCharacter(characterId);
      await handleClothingSelectedBase(characterId);
    } catch (error) {
      console.error('Error in clothing selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save clothing. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleArmorSelected = async () => {
    if (!characterId) return;
    try {
      setIsTransitioning(true);
      await verifyCharacter(characterId);
      await handleArmorSelectedBase(characterId);
    } catch (error) {
      console.error('Error in armor selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save armor. Please try again.",
      });
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
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected,
    handleBack,
  };
};