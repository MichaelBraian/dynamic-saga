import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";

interface ClothingSelectionProps {
  characterId: string;
  characterClass: string;
  onBack: () => void;
}

const CLOTHING_OPTIONS: Record<string, { value: string; label: string }[]> = {
  Barbarian: [
    { value: 'Fur Cloak', label: 'Fur Cloak: Thick and rugged, offering protection against the elements' },
    { value: 'Leather Harness', label: 'Leather Harness: Minimalistic and flexible for free movement in battle' },
    { value: 'Spiked Shoulder Pads', label: 'Spiked Shoulder Pads: Intimidating and symbolic of their primal nature' },
    { value: 'Hide Armor', label: 'Hide Armor: Durable and natural, made from animal pelts' },
  ],
  Bard: [
    { value: 'Performance Attire', label: 'Performance Attire: Colorful, flamboyant clothing designed to captivate audiences' },
    { value: 'Silken Tunic', label: 'Silken Tunic: Lightweight and elegant for a refined appearance' },
    { value: 'Embroidered Vest', label: 'Embroidered Vest: Stylish and charismatic, ideal for entertaining or diplomacy' },
    { value: 'Cloak of Charisma', label: 'Cloak of Charisma: A flowing garment that enhances their mystique' },
  ],
  // ... Add all other class clothing options following the same pattern
  Politician: [
    { value: "Diplomat's Robe", label: "Diplomat's Robe: Elegant clothing with intricate embroidery to signify status" },
    { value: 'Velvet Doublet', label: 'Velvet Doublet: A luxurious garment showcasing their wealth and power' },
    { value: 'Ceremonial Sash', label: 'Ceremonial Sash: A formal accessory denoting rank or allegiance' },
    { value: "Courtier's Attire", label: "Courtier's Attire: Practical yet refined clothing for social maneuvering" },
  ],
};

export const ClothingSelection = ({ characterId, characterClass, onBack }: ClothingSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClothingSelected = async (value: string) => {
    setIsSubmitting(true);
    try {
      // Update character status
      const { error: statusError } = await supabase
        .from('characters')
        .update({ status: 'questioning' })
        .eq('id', characterId);

      if (statusError) throw statusError;

      // Save clothing selection
      const { error: clothingError } = await supabase
        .from('character_clothing')
        .insert({ character_id: characterId, clothing_type: value });

      if (clothingError) throw clothingError;

      showSuccessToast(toast, "Clothing selected");
      navigate("/");
    } catch (error) {
      console.error('Error saving clothing selection:', error);
      toast({
        variant: "destructive",
        description: "Failed to save clothing selection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = CLOTHING_OPTIONS[characterClass] || [];

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Clothing"
        options={options}
        characterId={characterId}
        onSelected={handleClothingSelected}
        onBack={onBack}
        updateField="clothing_type"
        nextStatus="questioning"
      />
    </div>
  );
};