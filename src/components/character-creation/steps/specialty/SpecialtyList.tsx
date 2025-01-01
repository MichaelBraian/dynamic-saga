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
        const modifierClass = mod > 0 ? 'text-green-500' : 'text-red-500';
        return (
          <span key={attr}>
            <span className={modifierClass}>{modifierValue}</span>
            {` ${attr.charAt(0).toUpperCase() + attr.slice(1)}`}
          </span>
        );
      })
      .reduce((prev, curr) => (
        <>
          {prev}
          {prev && ', '}
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
            className="flex w-full items-center justify-between rounded-lg border-2 border-white/20 bg-white/20 p-4 hover:bg-white/30 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/30 cursor-pointer text-2xl font-['Cinzel'] text-white"
          >
            <div className="flex items-center gap-4">
              <span>{specialty.name}</span>
              <div className="flex items-center gap-2">
                <InfoTooltip content={specialty.description} />
                <span className="text-lg font-normal">
                  {formatModifiersText(specialty.attribute_modifiers)}
                </span>
              </div>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};