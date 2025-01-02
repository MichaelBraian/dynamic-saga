import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterCreationBackground } from "@/components/character-creation/CharacterCreationBackground";
import { useCharacterCreation } from "@/hooks/useCharacterCreation";
import { SafeZoneLayout } from "@/components/SafeZoneLayout";

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
    <ErrorBoundary>
      <SafeZoneLayout>
        <div className="relative w-full overflow-hidden">
          <CharacterCreationBackground currentStep={currentStep}>
            <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 min-h-[calc(100vh-4rem)] flex items-center justify-center">
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
        </div>
      </SafeZoneLayout>
    </ErrorBoundary>
  );
};

export default CreateCharacter;