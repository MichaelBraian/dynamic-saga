import { HamburgerMenu } from "@/components/HamburgerMenu";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterCreationBackground } from "@/components/character-creation/CharacterCreationBackground";
import { useCharacterCreation } from "@/hooks/useCharacterCreation";

const CreateCharacter = () => {
  const {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected,
    handleMoralityCompleted,
    handleAttributesCompleted,
    handleSpecialtySelected,
    handleFaithPointsCompleted,
    handleBack,
  } = useCharacterCreation();

  return (
    <CharacterCreationBackground currentStep={currentStep}>
      <HamburgerMenu />
      <div className="w-full max-w-screen-xl mx-auto px-4 min-h-screen flex items-center justify-center">
        <CharacterCreationSteps
          currentStep={currentStep}
          characterId={characterId}
          selectedRace={selectedRace}
          selectedAnimalType={selectedAnimalType}
          selectedClass={selectedClass}
          onNameSelected={handleNameSelected}
          onGenderSelected={handleGenderSelected}
          onRaceSelected={handleRaceSelected}
          onAnimalTypeSelected={handleAnimalTypeSelected}
          onClassSelected={handleClassSelected}
          onClothingSelected={handleClothingSelected}
          onArmorSelected={handleArmorSelected}
          onMoralityCompleted={handleMoralityCompleted}
          onAttributesCompleted={handleAttributesCompleted}
          onSpecialtySelected={handleSpecialtySelected}
          onFaithPointsCompleted={handleFaithPointsCompleted}
          onBack={handleBack}
        />
      </div>
    </CharacterCreationBackground>
  );
};

export default CreateCharacter;