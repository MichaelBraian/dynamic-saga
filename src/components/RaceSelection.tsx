import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { SelectionLoadingState } from "./shared/SelectionLoadingState";
import { ErrorBoundary } from "./shared/ErrorBoundary";
import { useRaceSelection } from "@/hooks/character/useRaceSelection";
import { useToast } from "@/hooks/use-toast";

interface RaceSelectionProps {
  characterId: string;
  onRaceSelected: () => Promise<void>;
  onBack: () => void;
}

const RACE_OPTIONS = [
  { value: 'Human', label: 'Human' },
  { value: 'Dwarf', label: 'Dwarf' },
  { value: 'Animal', label: 'Animal' }
];

export const RaceSelection = ({ 
  characterId, 
  onRaceSelected, 
  onBack 
}: RaceSelectionProps) => {
  const { toast } = useToast();
  const { isSubmitting, handleRaceSelected } = useRaceSelection({
    characterId,
    onRaceSelected
  });

  const handleSelection = async (race: string) => {
    try {
      console.log('Race Selection - Attempting to save race:', {
        characterId,
        race
      });

      if (!characterId) {
        toast({
          variant: "destructive",
          description: "Character ID is missing. Please try again.",
        });
        return;
      }

      await handleRaceSelected(race);
      
      console.log('Race Selection - Race saved successfully');
      
      toast({
        description: "Race selected successfully",
      });
    } catch (error) {
      console.error('Error in race selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save race selection. Please try again.",
      });
      throw error; // Re-throw to be handled by error boundary
    }
  };

  if (isSubmitting) {
    return (
      <div className="pt-16">
        <SelectionLoadingState message="Saving race selection..." />
      </div>
    );
  }

  return (
    <ErrorBoundary 
      fallback={
        <div className="text-white bg-red-500/20 p-4 rounded-lg">
          Something went wrong. Please refresh and try again.
        </div>
      }
    >
      <div className="pt-16">
        <CharacterSelectionScreen
          title="Choose Race"
          options={RACE_OPTIONS}
          characterId={characterId}
          onSelected={handleSelection}
          onBack={onBack}
          updateField="race"
          nextStatus="class"
          isSubmitting={isSubmitting}
        />
      </div>
    </ErrorBoundary>
  );
};