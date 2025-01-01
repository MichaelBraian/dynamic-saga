import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";

interface RaceSelectionProps {
  characterId: string;
  onRaceSelected: () => void;
  onBack: () => void;
}

const RACE_OPTIONS = [
  { value: 'Human', label: 'Human' },
  { value: 'Dwarf', label: 'Dwarf' },
  { value: 'Animal', label: 'Animal' }
];

export const RaceSelection = ({ characterId, onRaceSelected, onBack }: RaceSelectionProps) => {
  const handleRaceSelected = async (value: string) => {
    // Update the next status based on the selected race
    const nextStatus = value === 'Animal' ? 'animal_type' : 'class';
    
    try {
      const { error } = await supabase
        .from('characters')
        .update({ race: value, status: nextStatus })
        .eq('id', characterId);

      if (error) throw error;
      
      onRaceSelected();
    } catch (error) {
      console.error('Error updating race:', error);
    }
  };

  return (
    <CharacterSelectionScreen
      title="Choose Race"
      options={RACE_OPTIONS}
      characterId={characterId}
      onSelected={handleRaceSelected}
      onBack={onBack}
      updateField="race"
      nextStatus="class"
    />
  );
};