import { Star, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { attributes } from "../attributes/attributeDefinitions";

interface SpecialtySectionProps {
  name: string;
  description: string;
  attributeModifiers: Record<string, number>;
}

export const SpecialtySection = ({
  name,
  description,
  attributeModifiers,
}: SpecialtySectionProps) => {
  // Find attribute definitions for icons
  const getAttributeIcon = (attrName: string) => {
    const attr = attributes.find(a => a.name === attrName);
    return attr?.icon;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-bold text-white">{name}</h3>
      </div>

      {/* Description */}
      <div className="text-sm text-white/80 leading-relaxed">
        {description}
      </div>

      {/* Attribute Modifiers */}
      <div className="space-y-2">
        <div className="text-sm text-white/60">Attribute Modifiers:</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(attributeModifiers).map(([attr, mod]) => {
            const Icon = getAttributeIcon(attr);
            if (!Icon) return null;

            return (
              <div
                key={attr}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  mod > 0 ? "bg-green-500/10" : "bg-red-500/10"
                )}
              >
                <Icon className="h-4 w-4 text-white/60" />
                <span className="text-white/80">{attr}</span>
                <span
                  className={cn(
                    "ml-auto font-bold",
                    mod > 0 ? "text-green-400" : "text-red-400"
                  )}
                >
                  {mod > 0 ? (
                    <div className="flex items-center">
                      <ArrowUp className="h-3 w-3" />
                      {mod}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ArrowDown className="h-3 w-3" />
                      {Math.abs(mod)}
                    </div>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 