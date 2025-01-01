import { AttributeItem } from "./AttributeItem";

interface AttributesListProps {
  attributeRolls: Record<string, number | undefined>;
  onRollComplete: (attributeName: string, value: number) => void;
}

export const AttributesList = ({ attributeRolls, onRollComplete }: AttributesListProps) => {
  // Define the exact attribute names that match the database constraints
  const attributes = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {attributes.map((attributeName) => (
        <AttributeItem
          key={attributeName.toLowerCase()}
          name={attributeName.toLowerCase()}
          value={attributeRolls[attributeName.toLowerCase()]}
          onRollComplete={(value) => onRollComplete(attributeName.toLowerCase(), value)}
        />
      ))}
    </div>
  );
};