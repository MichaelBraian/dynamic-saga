import { HamburgerMenu } from "@/components/HamburgerMenu";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterBackground } from "@/components/character-creation/CharacterBackground";
import { useCharacterCreation } from "@/hooks/useCharacterCreation";
import { useCharacterNavigation } from "@/hooks/useCharacterNavigation";

const CreateCharacter = () => {
  const {
    characterId,
    setCharacterId,
    currentStep,
    setCurrentStep,
    selectedRace,
    setSelectedRace,
    selectedAnimalType,
    setSelectedAnimalType,
    selectedClass,
    setSelectedClass,
  } = useCharacterCreation();

  const { handleBack } = useCharacterNavigation();

  const handleNameSelected = (newCharacterId: string) => {
    setCharacterId(newCharacterId);
    setCurrentStep("gender");
  };

  const handleGenderSelected = () => {
    setCurrentStep("race");
  };

  const handleRaceSelected = async () => {
    if (characterId) {
      const { data } = await supabase
        .from('characters')
        .select('race, status')
        .eq('id', characterId)
        .single();
      
      setSelectedRace(data?.race || null);
      setCurrentStep(data?.status || 'class');
    }
  };

  const handleAnimalTypeSelected = (animalType: string) => {
    setSelectedAnimalType(animalType);
    setCurrentStep("class");
  };

  const handleClassSelected = (characterClass: string) => {
    setSelectedClass(characterClass);
    setCurrentStep("clothing");
  };

  const handleClothingSelected = () => {
    setCurrentStep("armor");
  };

  const handleNavigateBack = () => {
    handleBack(
      currentStep,
      setCurrentStep,
      setCharacterId,
      setSelectedRace,
      setSelectedAnimalType,
      setSelectedClass
    );
  };

  return (
    <>
      <CharacterBackground currentStep={currentStep} />
      <HamburgerMenu />
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
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
          onBack={handleNavigateBack}
        />
      </div>
    </>
  );
};

export default CreateCharacter;