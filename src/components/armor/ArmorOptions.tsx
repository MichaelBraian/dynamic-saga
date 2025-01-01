import { InfoTooltip } from "../shared/InfoTooltip";
import { ARMOR_OPTIONS } from "@/data/armorOptions";

interface ArmorOptionsProps {
  characterClass: string;
}

export const ArmorOptions = ({ characterClass }: ArmorOptionsProps) => {
  const options = ARMOR_OPTIONS[characterClass] || [];
  
  return options.map(option => ({
    value: option.value,
    label: option.value,
    labelComponent: (
      <div className="flex items-center gap-2">
        {option.value}
        <InfoTooltip content={option.label} />
      </div>
    ),
  }));
};