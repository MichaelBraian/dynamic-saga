import { Brain, Eye, Heart, Move, Sword, User } from "lucide-react";

export const attributes = [
  {
    name: "STR",
    label: "Strength",
    icon: Sword,
    description: "Determines physical power and melee combat effectiveness. Influences: Carrying capacity, damage dealt with heavy weapons, breaking objects.",
  },
  {
    name: "DEX",
    label: "Dexterity",
    icon: Move,
    description: "Reflects agility, speed, and precision. Influences: Dodging, accuracy with ranged weapons, stealth, and lock-picking.",
  },
  {
    name: "CON",
    label: "Constitution",
    icon: Heart,
    description: "Represents stamina, endurance, and overall health. Influences: Hit points (HP), resistance to fatigue or poison, physical durability.",
  },
  {
    name: "INT",
    label: "Intelligence",
    icon: Brain,
    description: "Measures reasoning, learning, and problem-solving skills. Influences: Spellcasting ability for certain classes, puzzle-solving, knowledge checks.",
  },
  {
    name: "WIS",
    label: "Wisdom",
    icon: Eye,
    description: "Reflects perception, insight, and spiritual connection. Influences: Resistance to mind-affecting spells, spotting hidden objects, intuition.",
  },
  {
    name: "CHA",
    label: "Charisma",
    icon: User,
    description: "Indicates personality, charm, and social influence. Influences: Persuasion, deception, leadership, and interactions with NPCs.",
  },
];