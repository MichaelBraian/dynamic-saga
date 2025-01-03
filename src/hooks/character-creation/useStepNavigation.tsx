import { useCallback } from "react";
import { CharacterStatus } from "@/types/character";

export const useStepNavigation = (
  currentStep: CharacterStatus,
  setCurrentStep: (step: CharacterStatus) => void,
  selectedRace: string | null,
  setSelectedRace: (race: string | null) => void,
  setSelectedAnimalType: (type: string | null) => void,
  setSelectedClass: (class_: string | null) => void,
) => {
  const handleBack = useCallback(() => {
    switch (currentStep) {
      case "gender":
        setCurrentStep("naming");
        return null; // Return null to indicate characterId should be reset
      case "race":
        setCurrentStep("gender");
        break;
      case "animal_type":
        setCurrentStep("race");
        setSelectedAnimalType(null);
        break;
      case "class":
        if (selectedRace === 'Animal') {
          setCurrentStep("animal_type");
        } else {
          setCurrentStep("race");
          setSelectedRace(null);
        }
        break;
      case "clothing":
        setCurrentStep("class");
        setSelectedClass(null);
        break;
      case "morality":
        setCurrentStep("clothing");
        break;
      case "attributes":
        setCurrentStep("morality");
        break;
      case "specialty":
        setCurrentStep("attributes");
        break;
      case "faith_points":
        setCurrentStep("specialty");
        break;
      default:
        break;
    }
    return undefined; // Undefined means don't reset characterId
  }, [currentStep, selectedRace, setCurrentStep, setSelectedRace, setSelectedAnimalType, setSelectedClass]);

  return { handleBack };
};