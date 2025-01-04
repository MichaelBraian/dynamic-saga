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
  const formatModifiersText = (modifiers: Record<string, number>) => {
    if (!modifiers) return null;

    return Object.entries(modifiers)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])) // Sort by absolute value
      .map(([attr, value], index) => {
        const prefix = value > 0 ? '+' : '';
        const modifierClass = value > 0 ? 'text-emerald-400' : 'text-rose-400';
        
        return (
          <span key={attr}>
            {index > 0 && <span className="text-white/50">, </span>}
            <span className={modifierClass}>
              {prefix}{value} {attr}
            </span>
          </span>
        );
      });
  };

  return (
    <RadioGroup
      className="space-y-4 animate-fade-in"
      onValueChange={onSelect}
      disabled={isSubmitting}
    >
      {specialties?.map((specialty) => (
        <div key={specialty.id} className="transition-all duration-200">
          <RadioGroupItem
            value={specialty.id}
            id={specialty.id}
            className="peer sr-only"
          />
          <Label
            htmlFor={specialty.id}
            className="flex w-full cursor-pointer rounded-lg border-2 border-white/20 bg-black/30 p-4 transition-all duration-200 hover:bg-white/10 hover:border-white/30 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-white/20"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel'] text-2xl text-white">
                  {specialty.name}
                </span>
                <InfoTooltip content={specialty.description} />
              </div>
              <div className="text-base font-medium">
                {formatModifiersText(specialty.attribute_modifiers)}
              </div>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};