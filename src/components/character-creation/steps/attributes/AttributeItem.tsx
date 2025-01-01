import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { DiceRoll } from "@/components/shared/DiceRoll";
import { LucideIcon } from "lucide-react";

interface AttributeItemProps {
  icon: LucideIcon;
  label: string;
  name: string;
  description: string;
  value: number | undefined;
  onRollComplete: (total: number) => void;
}

export const AttributeItem = ({ 
  icon: Icon, 
  label, 
  name, 
  description, 
  value, 
  onRollComplete 
}: AttributeItemProps) => {
  return (
    <div className="flex items-center gap-4 text-white p-4 rounded-lg bg-black/30">
      <div className="flex items-center gap-2 flex-1">
        <Icon className="h-5 w-5" />
        <span className="font-['Cinzel'] text-lg">{label}</span>
        <span className="text-sm opacity-70">({name})</span>
        <InfoTooltip content={description} />
      </div>
      <div className="flex items-center gap-2">
        {value === undefined && (
          <DiceRoll onRollComplete={onRollComplete} />
        )}
        {value !== undefined && (
          <span className="font-bold min-w-[2ch] text-center">{value}</span>
        )}
      </div>
    </div>
  );
};