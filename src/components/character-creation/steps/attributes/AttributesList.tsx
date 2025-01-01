import { AttributeItem } from "./AttributeItem";

interface AttributesListProps {
  attributeRolls: Record<string, number | undefined>;
  onRollComplete: (attributeName: string, value: number) => void;
}

export const AttributesList = ({ attributeRolls, onRollComplete }: AttributesListProps) => {
  const attributes = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {attributes.map((attributeName) => (
        <AttributeItem
          key={attributeName}
          name={attributeName}
          value={attributeRolls[attributeName]}
          onRollComplete={(value) => onRollComplete(attributeName, value)}
        />
      ))}
    </div>
  );
};