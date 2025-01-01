import { HamburgerMenu } from "@/components/HamburgerMenu";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterCreationBackground } from "@/components/character-creation/CharacterCreationBackground";
import { useMockCharacterCreation } from "@/hooks/character/mock/useMockCharacterCreation";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const CreateCharacter = () => {
  const {
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
  } = useMockCharacterCreation();

  console.log('CreateCharacter - Current State:', {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning
  });

  return (
    <ErrorBoundary>
      <CharacterCreationBackground currentStep={currentStep}>
        <HamburgerMenu />
        <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
          <CharacterCreationSteps
            currentStep={currentStep}
            characterId={characterId}
            selectedRace={selectedRace}
            selectedAnimalType={selectedAnimalType}
            selectedClass={selectedClass}
            isTransitioning={isTransitioning}
            onNameSelected={handleNameSelected}
            onGenderSelected={() => handleGenderSelected}
            onRaceSelected={() => handleRaceSelected}
            onAnimalTypeSelected={() => {}}
            onClassSelected={() => {}}
            onClothingSelected={() => {}}
            onArmorSelected={() => {}}
            onBack={handleBack}
          />
        </div>
      </CharacterCreationBackground>
    </ErrorBoundary>
  );
};

export default CreateCharacter;