import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";
import { CLASS_OPTIONS } from "@/data/classOptions";
import { InfoTooltip } from "./shared/InfoTooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ClassSelectionProps {
  characterId: string;
  onBack: () => void;
  onClassSelected: (characterClass: string) => void;
}

export const ClassSelection = ({ characterId, onBack, onClassSelected }: ClassSelectionProps) => {
  const { toast } = useToast();
  const [selectedRace, setSelectedRace] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterRace = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('race')
        .eq('id', characterId)
        .single();

      if (error) {
        console.error('Error fetching character race:', error);
        return;
      }

      setSelectedRace(data?.race || null);
    };

    fetchCharacterRace();
  }, [characterId]);

  const handleSelected = (value: string) => {
    showSuccessToast(toast, "Class selected");
    onClassSelected(value);
  };

  const filteredClassOptions = CLASS_OPTIONS.filter(option => {
    // If the class has no race restrictions, it's available to all races
    if (!option.allowedRaces) return true;
    // If we don't know the race yet, don't show restricted classes
    if (!selectedRace) return false;
    // Only show the class if the character's race is in the allowed races
    return option.allowedRaces.includes(selectedRace);
  });

  const classOptionsWithInfo = filteredClassOptions.map(option => ({
    value: option.value,
    label: option.value,
    labelComponent: (
      <div className="flex items-center gap-2">
        {option.value}
        <InfoTooltip content={option.description} />
      </div>
    ),
  }));

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Class"
        options={classOptionsWithInfo}
        characterId={characterId}
        onSelected={handleSelected}
        onBack={onBack}
        updateField="class"
        nextStatus="clothing"
      />
    </div>
  );
};