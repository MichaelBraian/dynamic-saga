import { AttributeItem } from "./AttributeItem";
import { attributes } from "./attributeDefinitions";

interface AttributesListProps {
  attributeRolls: Record<string, number | undefined>;
  onRollComplete: (attributeName: string, value: number) => void;
}

export const AttributesList = ({ attributeRolls, onRollComplete }: AttributesListProps) => {
  // Map from three-letter codes to full names for attribute rolls
  const attributeNameMap: Record<string, string> = {
    STR: "strength",
    DEX: "dexterity",
    CON: "constitution",
    INT: "intelligence",
    WIS: "wisdom",
    CHA: "charisma"
  };

  return (
    <div className="w-full space-y-3 relative z-0">
      {attributes.map((attr) => (
        <AttributeItem
          key={attr.name}
          name={attr.label}
          code={attr.name}
          icon={<attr.icon className="h-5 w-5 text-white/80" />}
          description={attr.description}
          value={attributeRolls[attributeNameMap[attr.name]]}
          onRollComplete={(value) => onRollComplete(attributeNameMap[attr.name], value)}
        />
      ))}
    </div>
  );
};