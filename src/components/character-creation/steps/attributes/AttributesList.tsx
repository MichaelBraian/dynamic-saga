import { AttributeItem } from "./AttributeItem";
import { 
  Swords, 
  Move, 
  Heart, 
  Brain, 
  Eye, 
  Users 
} from "lucide-react";

// Define valid attribute names as a constant to ensure consistency
const VALID_ATTRIBUTES = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as const;

// Display names for the attributes (for UI only)
const DISPLAY_NAMES: Record<typeof VALID_ATTRIBUTES[number], string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma"
};

// Short codes for attributes
const ATTRIBUTE_CODES: Record<typeof VALID_ATTRIBUTES[number], string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA"
};

// Icons for each attribute
const ATTRIBUTE_ICONS: Record<typeof VALID_ATTRIBUTES[number], React.ReactNode> = {
  strength: <Swords className="h-5 w-5" />,
  dexterity: <Move className="h-5 w-5" />,
  constitution: <Heart className="h-5 w-5" />,
  intelligence: <Brain className="h-5 w-5" />,
  wisdom: <Eye className="h-5 w-5" />,
  charisma: <Users className="h-5 w-5" />
};

// Descriptions for each attribute
const ATTRIBUTE_DESCRIPTIONS: Record<typeof VALID_ATTRIBUTES[number], string> = {
  strength: "Physical power and melee combat ability",
  dexterity: "Agility, reflexes, and ranged combat skill",
  constitution: "Endurance, stamina, and health points",
  intelligence: "Knowledge, memory, and magical aptitude",
  wisdom: "Perception, insight, and willpower",
  charisma: "Personality, leadership, and social influence"
};

interface AttributesListProps {
  attributeRolls: Record<string, number | undefined>;
  onRollComplete: (attributeName: string, value: number) => void;
}

export const AttributesList = ({ attributeRolls, onRollComplete }: AttributesListProps) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      {VALID_ATTRIBUTES.map((attributeName) => (
        <AttributeItem
          key={attributeName}
          name={DISPLAY_NAMES[attributeName]}
          code={ATTRIBUTE_CODES[attributeName]}
          icon={ATTRIBUTE_ICONS[attributeName]}
          description={ATTRIBUTE_DESCRIPTIONS[attributeName]}
          value={attributeRolls[attributeName]}
          onRollComplete={(value) => onRollComplete(attributeName, value)}
        />
      ))}
    </div>
  );
};