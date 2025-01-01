import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export const useMockHandlers = (
  updateState: (updates: any) => void,
  setIsTransitioning: (isTransitioning: boolean) => void
) => {
  const { toast } = useToast();

  const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

  const handleNameSelected = useCallback(async (name: string) => {
    try {
      setIsTransitioning(true);
      await simulateDelay();
      
      const newCharacterId = uuidv4();
      console.log('Mock character created:', { id: newCharacterId, name });
      
      updateState({
        characterId: newCharacterId,
        currentStep: "gender"
      });
      
      toast({
        description: "Character created successfully",
      });
    } catch (error) {
      console.error('Error in mock name selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to create character. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  }, [updateState, setIsTransitioning, toast]);

  const handleGenderSelected = useCallback(async (gender: string) => {
    try {
      setIsTransitioning(true);
      await simulateDelay();
      
      updateState({ 
        currentStep: "race",
        gender 
      });
      
      toast({
        description: "Gender selected successfully",
      });
    } catch (error) {
      console.error('Error in mock gender selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save gender. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  }, [updateState, setIsTransitioning, toast]);

  const handleRaceSelected = useCallback(async (race: string) => {
    try {
      setIsTransitioning(true);
      await simulateDelay();
      
      const nextStep = race === 'Animal' ? 'animal_type' : 'class';
      updateState({ 
        currentStep: nextStep,
        selectedRace: race 
      });
      
      toast({
        description: "Race selected successfully",
      });
    } catch (error) {
      console.error('Error in mock race selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save race. Please try again.",
      });
    } finally {
      setIsTransitioning(false);
    }
  }, [updateState, setIsTransitioning, toast]);

  return {
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
  };
};