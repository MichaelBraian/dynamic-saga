import { Race, Class } from "@/types/character";

interface ClassValidationRule {
  race: Race;
  forbiddenClasses: Class[];
  reason: string;
}

const CLASS_VALIDATION_RULES: ClassValidationRule[] = [
  {
    race: "Animal",
    forbiddenClasses: ["Paladin", "Artificer"],
    reason: "Animals cannot master the complex disciplines required for these classes"
  },
  {
    race: "Dwarf",
    forbiddenClasses: ["Dragon Trainer"],
    reason: "Dwarves have a cultural aversion to dragon training"
  }
];

export const validateClassSelection = (race: Race, selectedClass: Class): { 
  isValid: boolean; 
  reason?: string;
} => {
  const rule = CLASS_VALIDATION_RULES.find(r => r.race === race);
  
  if (!rule) {
    return { isValid: true };
  }

  const isForbidden = rule.forbiddenClasses.includes(selectedClass);
  
  return {
    isValid: !isForbidden,
    reason: isForbidden ? rule.reason : undefined
  };
};

export const getFallbackClass = (race: Race): Class => {
  const fallbacks: Record<Race, Class> = {
    'Animal': 'Druid',
    'Human': 'Fighter',
    'Dwarf': 'Fighter'
  };
  return fallbacks[race];
};