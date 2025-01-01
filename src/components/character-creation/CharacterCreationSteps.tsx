import { CharacterStatus } from "@/types/character";
import { NameStep } from "./steps/NameStep";
import { GenderStep } from "./steps/GenderStep";
import { RaceStep } from "./steps/RaceStep";
import { AnimalTypeStep } from "./steps/AnimalTypeStep";
import { ClassStep } from "./steps/ClassStep";
import { ClothingStep } from "./steps/ClothingStep";
import { ArmorStep } from "./steps/ArmorStep";
import { MoralityStep } from "./steps/MoralityStep";
import { AttributesStep } from "./steps/AttributesStep";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CharacterCreationStepsProps {
  currentStep: CharacterStatus;
  characterId: string | null;
  selectedRace: string | null;
  selectedAnimalType: string | null;
  selectedClass: string | null;
  isLoading: boolean;
  isRetrying: boolean;
  onNameSelected: (newCharacterId: string) => void;
  onGenderSelected: () => void;
  onRaceSelected: () => Promise<void>;
  onAnimalTypeSelected: (animalType: string) => void;
  onClassSelected: (characterClass: string) => void;
  onClothingSelected: () => void;
  onArmorSelected: () => void;
  onBack: () => void;
}

export const CharacterCreationSteps = ({
  currentStep,
  characterId,
  selectedRace,
  selectedAnimalType,
  selectedClass,
  isLoading,
  isRetrying,
  onNameSelected,
  onGenderSelected,
  onRaceSelected,
  onAnimalTypeSelected,
  onClassSelected,
  onClothingSelected,
  onArmorSelected,
  onBack,
}: CharacterCreationStepsProps) => {
  useEffect(() => {
    if (!characterId) return;

    const channel = supabase
      .channel(`character_status_${characterId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'characters',
          filter: `id=eq.${characterId}`,
        },
        (payload: any) => {
          console.log('Character status changed:', payload.new.status);
          const newStatus = payload.new.status as CharacterStatus;
          if (newStatus === 'attributes' && currentStep === 'morality') {
            console.log('Transitioning from morality to attributes step');
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up character status subscription');
      supabase.removeChannel(channel);
    };
  }, [characterId, currentStep]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isRetrying) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-white">Retrying operation...</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case "naming":
        return <NameStep onNameSelected={onNameSelected} />;
      case "gender":
        return (
          <GenderStep 
            characterId={characterId!} 
            onGenderSelected={onGenderSelected}
            onBack={onBack}
          />
        );
      case "race":
        return (
          <RaceStep 
            characterId={characterId!} 
            onRaceSelected={onRaceSelected}
            onBack={onBack}
          />
        );
      case "animal_type":
        return (
          <AnimalTypeStep 
            characterId={characterId!}
            onBack={onBack}
            onAnimalTypeSelected={onAnimalTypeSelected}
          />
        );
      case "class":
        return (
          <ClassStep 
            characterId={characterId!}
            onBack={onBack}
            onClassSelected={onClassSelected}
          />
        );
      case "clothing":
        return (
          <ClothingStep
            characterId={characterId!}
            selectedClass={selectedClass!}
            onBack={onBack}
            onClothingSelected={onClothingSelected}
          />
        );
      case "armor":
        return (
          <ArmorStep
            characterId={characterId!}
            selectedClass={selectedClass!}
            onBack={onBack}
            onArmorSelected={onArmorSelected}
          />
        );
      case "morality":
        return (
          <MoralityStep
            characterId={characterId!}
            onBack={onBack}
          />
        );
      case "attributes":
        return (
          <AttributesStep
            characterId={characterId!}
            onBack={onBack}
          />
        );
      default:
        console.error('Unknown step:', currentStep);
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {renderStep()}
    </div>
  );
};
