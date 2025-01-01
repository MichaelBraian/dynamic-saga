import { useState, useEffect } from "react";
import { CharacterStatus } from "@/types/character";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCharacterCreation = () => {
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<CharacterStatus>("naming");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!characterId) return;

    console.log('Setting up real-time subscription for character:', characterId);
    
    const channel = supabase
      .channel('character_status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'characters',
          filter: `id=eq.${characterId}`,
        },
        (payload: any) => {
          console.log('Character status updated:', payload.new.status);
          if (payload.new && payload.new.status) {
            setCurrentStep(payload.new.status as CharacterStatus);
          }
        }
      )
      .subscribe();

    const fetchCharacter = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Authentication required");

        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('id', characterId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Character not found");

        setCurrentStep(data.status);
        setSelectedRace(data.race);
        setSelectedAnimalType(data.animal_type);
        setSelectedClass(data.class);
      } catch (error) {
        console.error('Error fetching character:', error);
        toast({
          variant: "destructive",
          description: "Failed to load character data. Please try again.",
        });
      }
    };

    fetchCharacter();

    return () => {
      console.log('Cleaning up character status subscription');
      supabase.removeChannel(channel);
    };
  }, [characterId, toast]);

  const handleNameSelected = (newCharacterId: string) => {
    setCharacterId(newCharacterId);
    setCurrentStep("gender");
  };

  const handleGenderSelected = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      const { error } = await supabase
        .from('characters')
        .update({ status: 'race' })
        .eq('id', characterId);

      if (error) throw error;
      setCurrentStep("race");
    } catch (error) {
      console.error('Error updating gender status:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed to next step. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleRaceSelected = async () => {
    if (isTransitioning || !characterId) return;
    setIsTransitioning(true);
    
    try {
      const { data } = await supabase
        .from('characters')
        .select('race, status')
        .eq('id', characterId)
        .single();
      
      setSelectedRace(data?.race || null);
      setCurrentStep(data?.status || 'class');
    } catch (error) {
      console.error('Error handling race selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save race selection. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleAnimalTypeSelected = (animalType: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      setSelectedAnimalType(animalType);
      setCurrentStep("class");
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClassSelected = (characterClass: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      setSelectedClass(characterClass);
      setCurrentStep("clothing");
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleClothingSelected = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      setCurrentStep("armor");
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleArmorSelected = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      console.log("Armor selected, transitioning to morality");
      setCurrentStep("morality");
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleBack = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      let newStatus: CharacterStatus;
      switch (currentStep) {
        case "gender":
          newStatus = "naming";
          setCharacterId(null);
          break;
        case "race":
          newStatus = "gender";
          break;
        case "animal_type":
          newStatus = "race";
          setSelectedAnimalType(null);
          break;
        case "class":
          newStatus = selectedRace === 'Animal' ? "animal_type" : "race";
          if (newStatus === "race") setSelectedRace(null);
          break;
        case "clothing":
          newStatus = "class";
          setSelectedClass(null);
          break;
        case "armor":
          newStatus = "clothing";
          break;
        case "morality":
          newStatus = "armor";
          break;
        case "attributes":
          newStatus = "morality";
          break;
        default:
          setIsTransitioning(false);
          return;
      }

      if (characterId) {
        const { error } = await supabase
          .from('characters')
          .update({ status: newStatus })
          .eq('id', characterId);

        if (error) throw error;
      }
      
      setCurrentStep(newStatus);
    } catch (error) {
      console.error('Error handling back navigation:', error);
      toast({
        variant: "destructive",
        description: "Failed to go back. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  return {
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
  };
};