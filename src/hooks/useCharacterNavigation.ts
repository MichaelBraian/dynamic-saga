import { CharacterStatus } from "@/types/character";

export const useCharacterNavigation = () => {
  const handleBack = (
    currentStep: CharacterStatus,
    setCurrentStep: (step: CharacterStatus) => void,
    setCharacterId: (id: string | null) => void,
    setSelectedRace: (race: string | null) => void,
    setSelectedAnimalType: (type: string | null) => void,
    setSelectedClass: (characterClass: string | null) => void,
  ) => {
    switch (currentStep) {
      case "gender":
        setCurrentStep("naming");
        setCharacterId(null);
        break;
      case "race":
        setCurrentStep("gender");
        break;
      case "animal_type":
        setCurrentStep("race");
        setSelectedAnimalType(null);
        break;
      case "class":
        setCurrentStep(selectedRace === 'Animal' ? "animal_type" : "race");
        if (selectedRace !== 'Animal') {
          setSelectedRace(null);
        }
        break;
      case "clothing":
        setCurrentStep("class");
        setSelectedClass(null);
        break;
      case "armor":
        setCurrentStep("clothing");
        break;
      case "morality":
        setCurrentStep("armor");
        break;
      default:
        break;
    }
  };

  return { handleBack };
};