import { HamburgerMenu } from "@/components/HamburgerMenu";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterCreationBackground } from "@/components/character-creation/CharacterCreationBackground";
import { useCharacterCreation } from "@/hooks/useCharacterCreation";
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
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected,
    handleBack,
  } = useCharacterCreation();

  console.log('CreateCharacter rendering with:', {
    characterId,
    currentStep,
    selectedRace,
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
            onGenderSelected={handleGenderSelected}
            onRaceSelected={() => handleRaceSelected(characterId!)}
            onAnimalTypeSelected={handleAnimalTypeSelected}
            onClassSelected={handleClassSelected}
            onClothingSelected={handleClothingSelected}
            onArmorSelected={handleArmorSelected}
            onBack={handleBack}
          />
        </div>
      </CharacterCreationBackground>
    </ErrorBoundary>
  );
};

export default CreateCharacter;