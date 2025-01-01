import { HamburgerMenu } from "@/components/HamburgerMenu";
import { CharacterCreationSteps } from "@/components/character-creation/CharacterCreationSteps";
import { CharacterCreationBackground } from "@/components/character-creation/CharacterCreationBackground";
import { useCharacterCreation } from "@/hooks/useCharacterCreation";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";

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
    handleBack,
    setCurrentStep,
  } = useCharacterCreation();

  useEffect(() => {
    if (!characterId) return;

    console.log('Setting up character status subscription for:', characterId);
    
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
          if (payload.new && payload.new.status) {
            setCurrentStep(payload.new.status as CharacterStatus);
          }
        }
      )
      .subscribe();

    // Initial fetch of character status
    const fetchCharacterStatus = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('status')
        .eq('id', characterId)
        .single();

      if (!error && data) {
        console.log('Initial character status:', data.status);
        setCurrentStep(data.status);
      }
    };

    fetchCharacterStatus();

    return () => {
      console.log('Cleaning up character status subscription');
      supabase.removeChannel(channel);
    };
  }, [characterId, setCurrentStep]);

  return (
    <CharacterCreationBackground currentStep={currentStep}>
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
          onArmorSelected={handleArmorSelected}
          onBack={handleBack}
        />
      </div>
    </CharacterCreationBackground>
  );
};

export default CreateCharacter;