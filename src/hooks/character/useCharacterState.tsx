import { useState } from "react";
import { CharacterStatus } from "@/types/character";
import { useToast } from "@/hooks/use-toast";

export const useCharacterState = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<CharacterStatus>("naming");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();

  const updateCharacterState = (
    newCharacterId: string | null,
    newStep: CharacterStatus,
    newRace?: string | null,
    newAnimalType?: string | null,
    newClass?: string | null
  ) => {
    if (newCharacterId !== undefined) setCharacterId(newCharacterId);
    if (newStep) setCurrentStep(newStep);
    if (newRace !== undefined) setSelectedRace(newRace);
    if (newAnimalType !== undefined) setSelectedAnimalType(newAnimalType);
    if (newClass !== undefined) setSelectedClass(newClass);
  };

  return {
    characterId,
    currentStep,
    selectedRace,
    selectedAnimalType,
    selectedClass,
    isTransitioning,
    setIsTransitioning,
    updateCharacterState,
    toast
  };
};