interface ArmorOption {
  value: string;
  label: string;
}

type ArmorOptionsByClass = {
  [key: string]: ArmorOption[];
};

export const ARMOR_OPTIONS: ArmorOptionsByClass = {
  Barbarian: [
    { value: "Hide Armor", label: "Durable and made from animal pelts, perfect for rugged warriors." },
    { value: "Spiked Leather Armor", label: "Intimidating and practical for close combat." },
    { value: "Reinforced Fur Cloak", label: "Offers warmth and minor protection, with a primal aesthetic." },
    { value: "Bone-Plated Vest", label: "Constructed from the remains of defeated foes, symbolic and functional." },
  ],
  Bard: [
    { value: "Studded Leather Armor", label: "Light and flexible, with decorative studs for flair." },
    { value: "Padded Gambeson", label: "A quilted jacket offering modest protection while maintaining agility." },
    { value: "Silken Chainmail", label: "A lightweight chainmail designed to be both functional and stylish." },
    { value: "Enchanted Cloak", label: "Provides magical defense rather than physical protection." },
  ],
  Cleric: [
    { value: "Blessed Chainmail", label: "Holy armor infused with protective enchantments." },
    { value: "Ritual Plate Armor", label: "A ceremonial yet functional set engraved with divine symbols." },
    { value: "Tabard of Faith", label: "A decorative overlay worn over armor, signifying their deity." },
    { value: "Holy Breastplate", label: "A single-piece armor with radiant engravings, offering strong defense." },
  ],
  Druid: [
    { value: "Leaf-Woven Cloak", label: "A natural garment offering camouflage and magical protection." },
    { value: "Hide Tunic", label: "Simple armor made from animal skins for light defense." },
    { value: "Vine-Enchanted Robes", label: "Mystical clothing infused with protective natural magic." },
    { value: "Nature's Aegis", label: "Magical bark armor that grows over the wearer, providing light protection." },
  ],
  Fighter: [
    { value: "Plate Armor", label: "A full suit offering the highest level of physical protection." },
    { value: "Chainmail", label: "Balanced protection with good mobility for diverse combat roles." },
    { value: "Brigandine", label: "A combination of leather and steel plates for versatility." },
    { value: "Half-Plate", label: "A lighter alternative to full plate armor, balancing mobility and defense." },
  ],
  Monk: [
    { value: "Cloth Wraps", label: "Simple bindings around hands, feet, and wrists for agility and combat." },
    { value: "Sash of Resilience", label: "A belt enchanted to enhance endurance and agility." },
    { value: "Mystic Gi", label: "Traditional martial arts attire infused with minor protective magic." },
    { value: "Meditation Robes", label: "Lightweight clothing allowing full range of movement." },
  ],
  Paladin: [
    { value: "Holy Plate Armor", label: "Gleaming, full-body armor blessed with divine power." },
    { value: "Silver-Edged Chainmail", label: "A highly polished chainmail offering both protection and symbolism." },
    { value: "Ceremonial Breastplate", label: "Intricately designed armor worn in battle and rituals." },
    { value: "Tabard of Valor", label: "A decorative and functional piece signifying their oath and order." },
  ],
  Ranger: [
    { value: "Leather Armor", label: "Lightweight and quiet, ideal for stealth and mobility." },
    { value: "Cloak of Shadows", label: "Provides magical concealment and light defense." },
    { value: "Reinforced Jerkin", label: "A rugged leather chest piece with metal reinforcements." },
    { value: "Camouflage Armor", label: "Designed to blend into natural surroundings while offering light protection." },
  ],
  Rogue: [
    { value: "Shadow-Woven Leather", label: "Lightweight, dark armor that enhances stealth." },
    { value: "Thieves' Chainmail", label: "A light chainmail designed to minimize noise during movement." },
    { value: "Padded Vest", label: "Offers some protection without sacrificing agility." },
    { value: "Enchanted Cloak", label: "A magically enhanced garment that provides defense against detection." },
  ],
  Sorcerer: [
    { value: "Arcane Robes", label: "Flowing garments imbued with magical barriers for defense." },
    { value: "Crystal-Woven Cloak", label: "Provides a shield-like aura against physical and magical attacks." },
    { value: "Mana-Infused Tunic", label: "Lightweight clothing that boosts spellcasting while offering minor protection." },
    { value: "Magical Barrier Amulet", label: "Worn instead of armor, this item creates a protective aura." },
  ],
  Warlock: [
    { value: "Infernal Robes", label: "Dark garments enchanted with protective eldritch energy." },
    { value: "Pact-Woven Cloak", label: "Provides moderate magical defense tied to their patron." },
    { value: "Shadow Armor", label: "A magical, form-fitting garment that absorbs light and damage." },
    { value: "Eldritch Vestments", label: "Worn over normal clothing, these provide minor protection through magic." },
  ],
  Wizard: [
    { value: "Rune-Inscribed Robes", label: "Magical robes that offer protection through arcane symbols." },
    { value: "Apprentice's Cloak", label: "Lightweight and functional, with minor magical enhancements." },
    { value: "Mage's Barrier Wrap", label: "A garment that boosts defense through enchanted layers." },
    { value: "Staff-Enchanted Shielding", label: "Defensive magic bound to their staff instead of physical armor." },
  ],
  Artificer: [
    { value: "Mechanized Chestplate", label: "Armor enhanced with mechanical components for added functionality." },
    { value: "Reinforced Leather Armor", label: "Flexible and durable, with compartments for tools." },
    { value: "Gadgeteer's Vest", label: "A lightweight, utility-based vest with defensive properties." },
    { value: "Plated Gauntlets", label: "Heavy, protective gloves that enhance physical strength." },
  ],
  Trollslayer: [
    { value: "Chainmail of Resolve", label: "A durable armor designed to withstand heavy blows." },
    { value: "Battle-Hardened Plate", label: "Scuffed and worn from countless troll battles, but highly effective." },
    { value: "Spiked Armor", label: "Offensive armor that injures enemies in close combat." },
    { value: "Fur-Lined Vest", label: "Practical and warm, ideal for hunting trolls in harsh conditions." },
  ],
  Berserker: [
    { value: "Ragebound Leather", label: "Light armor designed to enhance movement during frenzied attacks." },
    { value: "Bloodstained Plate", label: "A heavy yet symbolic armor marked by battles past." },
    { value: "Wolf-Pelt Mantle", label: "Offers minimal protection but enhances their primal aesthetic." },
    { value: "Bone-Spiked Harness", label: "Functional and intimidating, crafted from the remains of their foes." },
  ],
  "Dragon Trainer": [
    { value: "Scaled Leather Armor", label: "Crafted from shed dragon scales, offering both flexibility and durability." },
    { value: "Flame-Resistant Cloak", label: "Designed to protect against fire-based attacks." },
    { value: "Dragonbone Plating", label: "Light yet strong armor made from the bones of fallen dragons." },
    { value: "Tamer's Vest", label: "A practical outfit with reinforced shoulders for handling dragons." },
  ],
  Politician: [
    { value: "Diplomat's Coat", label: "A lightly armored, decorative coat for ceremonial and political engagements." },
    { value: "Velvet-Lined Breastplate", label: "Offers some protection while maintaining an air of sophistication." },
    { value: "Enchanted Sash", label: "Provides minor magical defense while serving as a status symbol." },
    { value: "Courtier's Vest", label: "Stylish clothing with subtle reinforcements for safety." },
  ],
};