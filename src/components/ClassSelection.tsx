import { Info } from "lucide-react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { showSuccessToast } from "@/utils/toast";

interface ClassSelectionProps {
  characterId: string;
  onBack: () => void;
  onClassSelected: (characterClass: string) => void;
}

const CLASS_OPTIONS = [
  { value: 'Barbarian', label: 'Barbarian: A primal warrior driven by rage and raw physical power. Excels in close combat with high durability and devastating attacks.' },
  { value: 'Bard', label: 'Bard: A charismatic performer who uses music and magic to inspire allies, manipulate enemies, and create versatile effects.' },
  { value: 'Cleric', label: 'Cleric: A divine spellcaster who channels the power of their deity to heal, protect, and smite enemies.' },
  { value: 'Druid', label: 'Druid: A nature-based spellcaster with the ability to shapeshift into animals and wield elemental magic.' },
  { value: 'Fighter', label: 'Fighter: A master of combat, versatile in any weapon or armor, capable of excelling in offensive and defensive roles.' },
  { value: 'Monk', label: 'Monk: A disciplined martial artist who uses unarmed combat and agility, often enhanced by mystical ki powers.' },
  { value: 'Paladin', label: 'Paladin: A holy knight bound by an oath, combining melee combat with divine magic to protect allies and smite foes.' },
  { value: 'Ranger', label: 'Ranger: A skilled tracker and hunter, adept in ranged and melee combat, often with a bond to nature or animal companions.' },
  { value: 'Rogue', label: 'Rogue: A cunning and stealthy character specializing in sneak attacks, traps, and deception.' },
  { value: 'Sorcerer', label: 'Sorcerer: A natural-born spellcaster who channels raw magical power, often relying on innate talent rather than study.' },
  { value: 'Warlock', label: 'Warlock: A spellcaster who gains their magic through a pact with a powerful patron, blending eldritch magic with combat.' },
  { value: 'Wizard', label: 'Wizard: A learned spellcaster who masters a wide range of spells through rigorous study and research.' },
  { value: 'Artificer', label: 'Artificer: A master inventor who combines magic and technology to create gadgets, enchantments, and mechanical constructs.' },
  { value: 'Trollslayer', label: 'Trollslayer: A fearless warrior dedicated to hunting and slaying trolls. Known for their unmatched courage and resilience, they often seek redemption or glory through dangerous battles against monstrous foes.' },
  { value: 'Berserker', label: 'Berserker: A frenzied warrior who embraces uncontrollable rage to deliver devastating attacks. While they sacrifice defense and precision, their sheer aggression makes them unstoppable in battle.' },
  { value: 'Dragon Trainer', label: 'Dragon Trainer: A specialist in taming and bonding with dragons, using a mix of magic, knowledge, and bravery. They can command their dragon companions in combat, granting immense power and versatility.' },
  { value: 'Politician', label: 'Politician: A master of persuasion and influence, adept at navigating complex social dynamics. They manipulate events, forge alliances, and use their charisma to control outcomes both on and off the battlefield.' },
];

export const ClassSelection = ({ characterId, onBack, onClassSelected }: ClassSelectionProps) => {
  const { toast } = useToast();

  const handleSelected = (value: string) => {
    showSuccessToast(toast, "Class selected");
    onClassSelected(value);
  };

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Class"
        options={CLASS_OPTIONS}
        characterId={characterId}
        onSelected={handleSelected}
        onBack={onBack}
        updateField="class"
        nextStatus="clothing"
      />
    </div>
  );
};