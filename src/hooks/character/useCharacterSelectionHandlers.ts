import { useBasicCharacterHandlers } from "./handlers/useBasicCharacterHandlers";
import { useRaceAndTypeHandlers } from "./handlers/useRaceAndTypeHandlers";
import { useClassAndEquipmentHandlers } from "./handlers/useClassAndEquipmentHandlers";

export const useCharacterSelectionHandlers = () => {
  const { handleNameSelected, handleGenderSelected } = useBasicCharacterHandlers();
  const { handleRaceSelected, handleAnimalTypeSelected } = useRaceAndTypeHandlers();
  const { handleClassSelected, handleClothingSelected, handleArmorSelected } = useClassAndEquipmentHandlers();

  return {
    handleNameSelected,
    handleGenderSelected,
    handleRaceSelected,
    handleAnimalTypeSelected,
    handleClassSelected,
    handleClothingSelected,
    handleArmorSelected
  };
};