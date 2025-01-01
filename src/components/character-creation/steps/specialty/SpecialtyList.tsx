import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/shared/InfoTooltip";

interface Specialty {
  id: string;
  name: string;
  description: string;
  attribute_modifiers: Record<string, number>;
}

interface SpecialtyListProps {
  specialties: Specialty[];
  onSelect: (specialtyId: string) => void;
  isSubmitting: boolean;
}

export const SpecialtyList = ({ specialties, onSelect, isSubmitting }: SpecialtyListProps) => {
  const formatModifier = (value: number) => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  const formatModifiersText = (modifiers: Record<string, number>) => {
    return Object.entries(modifiers)
      .map(([attr, mod]) => {
        const modifierValue = formatModifier(mod);
        const modifierClass = mod > 0 ? 'text-emerald-400' : 'text-rose-400';
        return (
          <span key={attr} className="inline-flex items-center gap-1">
            <span className={`${modifierClass} font-bold`}>{modifierValue}</span>
            <span className="text-white/80">{attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
          </span>
        );
      })
      .reduce((prev, curr) => (
        <>
          {prev}
          {prev && <span className="mx-2 text-white/50">/</span>}
          {curr}
        </>
      ), null);
  };

  return (
    <RadioGroup
      className="space-y-4"
      onValueChange={onSelect}
      disabled={isSubmitting}
    >
      {specialties?.map((specialty) => (
        <div key={specialty.id}>
          <RadioGroupItem
            value={specialty.id}
            id={specialty.id}
            className="peer sr-only"
          />
          <Label
            htmlFor={specialty.id}
            className="flex w-full cursor-pointer rounded-lg border-2 border-white/20 bg-white/10 p-4 hover:bg-white/20 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/20"
          >
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel'] text-2xl text-white">{specialty.name}</span>
                <InfoTooltip content={specialty.description} />
              </div>
              <div className="text-base font-normal">
                {formatModifiersText(specialty.attribute_modifiers)}
              </div>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};