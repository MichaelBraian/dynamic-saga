import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterCreationBackground } from "@/components/character-creation/CharacterCreationBackground";
import { useCharacterCreation } from "@/hooks/useCharacterCreation";
import { SafeZoneLayout } from "@/components/SafeZoneLayout";
import { CharacterProvider } from "@/contexts/characterContext";

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
    handleMoralityCompleted,
    handleAttributesCompleted,
    handleSpecialtySelected,
    handleFaithPointsCompleted,
    handleBack,
  } = useCharacterCreation();

  return (
    <ErrorBoundary>
      <SafeZoneLayout>
        <CharacterProvider>
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
                  onMoralityCompleted={handleMoralityCompleted}
                  onAttributesCompleted={handleAttributesCompleted}
                  onSpecialtySelected={handleSpecialtySelected}
                  onFaithPointsCompleted={handleFaithPointsCompleted}
                  onBack={handleBack}
                />
              </div>
            </CharacterCreationBackground>
          </div>
        </CharacterProvider>
      </SafeZoneLayout>
    </ErrorBoundary>
  );
};

export default CreateCharacter;