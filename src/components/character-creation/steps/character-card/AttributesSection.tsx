import { cn } from "@/lib/utils";
import { attributes } from "../attributes/attributeDefinitions";

interface AttributesSectionProps {
  attributes: Array<{
    attribute_name: string;
    base_value: number;
    modifier: number;
    value: number;
  }>;
}

export const AttributesSection = ({ attributes: characterAttributes }: AttributesSectionProps) => {
  // Convert array to record for easier lookup
  const attributeRecord = characterAttributes.reduce((acc, attr) => {
    acc[attr.attribute_name] = {
      base: attr.base_value,
      modifier: attr.modifier,
      total: attr.value
    };
    return acc;
  }, {} as Record<string, { base: number; modifier: number; total: number }>);

  return (
    <div className="grid grid-cols-2 gap-3">
      {attributes.map((attr) => {
        const attrValues = attributeRecord[attr.name];
        const hasModifier = attrValues?.modifier !== 0;
        
        return (
          <div key={attr.name} className="flex items-center gap-2 bg-black/20 p-3 rounded-lg">
            <attr.icon className="h-5 w-5 text-white/80" />
            <div>
              <div className="text-sm text-white/60">{attr.label}</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold text-white">
                  {attrValues?.total || 0}
                </div>
                {hasModifier && (
                  <div className={cn(
                    "text-sm",
                    attrValues?.modifier > 0 ? "text-green-400" : "text-red-400"
                  )}>
                    ({attrValues?.base} {attrValues?.modifier > 0 ? "+" : ""}{attrValues?.modifier})
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 