import { AttributeItem } from "./AttributeItem";
import { attributes } from "./attributeDefinitions";

interface AttributesListProps {
  attributeRolls: Record<string, number | undefined>;
  onRollComplete: (attributeName: string, total: number) => void;
}

export const AttributesList = ({ attributeRolls, onRollComplete }: AttributesListProps) => (
  <div className="space-y-4">
    {attributes.map((attr) => (
      <AttributeItem
        key={attr.name}
        icon={attr.icon}
        label={attr.label}
        name={attr.name}
        description={attr.description}
        value={attributeRolls[attr.name]}
        onRollComplete={(total) => onRollComplete(attr.name, total)}
      />
    ))}
  </div>
);