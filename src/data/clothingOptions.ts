interface ClothingOption {
  value: string;
  label: string;
}

export const CLOTHING_OPTIONS: Record<string, ClothingOption[]> = {
  Barbarian: [
    { value: 'Fur Cloak', label: 'Fur Cloak: Thick and rugged, offering protection against the elements' },
    { value: 'Leather Harness', label: 'Leather Harness: Minimalistic and flexible for free movement in battle' },
    { value: 'Spiked Shoulder Pads', label: 'Spiked Shoulder Pads: Intimidating and symbolic of their primal nature' },
    { value: 'Hide Armor', label: 'Hide Armor: Durable and natural, made from animal pelts' },
  ],
  Bard: [
    { value: 'Performance Attire', label: 'Performance Attire: Colorful, flamboyant clothing designed to captivate audiences' },
    { value: 'Silken Tunic', label: 'Silken Tunic: Lightweight and elegant for a refined appearance' },
    { value: 'Embroidered Vest', label: 'Embroidered Vest: Stylish and charismatic, ideal for entertaining or diplomacy' },
    { value: 'Cloak of Charisma', label: 'Cloak of Charisma: A flowing garment that enhances their mystique' },
  ],
  Cleric: [
    { value: 'Holy Vestments', label: 'Holy Vestments: Sacred robes adorned with religious symbols' },
    { value: 'Ceremonial Armor', label: 'Ceremonial Armor: Protective gear inscribed with divine markings' },
    { value: 'Prayer Shawl', label: 'Prayer Shawl: A blessed garment worn during religious ceremonies' },
    { value: 'Divine Regalia', label: 'Divine Regalia: Ornate clothing that channels divine power' },
  ],
  Druid: [
    { value: 'Natural Robes', label: 'Natural Robes: Clothing woven from natural fibers and leaves' },
    { value: 'Bark Armor', label: 'Bark Armor: Protective covering made from treated tree bark' },
    { value: 'Vine Wrappings', label: 'Vine Wrappings: Living vines that grow and adapt with the wearer' },
    { value: 'Moss Cloak', label: 'Moss Cloak: A cloak that helps blend with natural surroundings' },
  ],
  Fighter: [
    { value: 'Plate Armor', label: 'Plate Armor: Heavy, full-body protection for maximum defense' },
    { value: 'Chain Mail', label: 'Chain Mail: Flexible armor made of interlocking metal rings' },
    { value: 'Battle Harness', label: 'Battle Harness: Practical gear for carrying weapons and equipment' },
    { value: 'War Cloak', label: 'War Cloak: A durable cloak that provides additional protection' },
  ],
  Monk: [
    { value: 'Training Gi', label: 'Training Gi: Traditional martial arts attire for maximum mobility' },
    { value: 'Temple Robes', label: 'Temple Robes: Lightweight garments worn during meditation' },
    { value: 'Combat Wraps', label: 'Combat Wraps: Cloth bindings that protect hands and feet' },
    { value: 'Ceremonial Sash', label: 'Ceremonial Sash: A belt that signifies mastery and rank' },
  ],
  Paladin: [
    { value: 'Holy Armor', label: 'Holy Armor: Blessed plate armor that radiates divine light' },
    { value: 'Crusader Regalia', label: 'Crusader Regalia: Ornate armor bearing holy symbols' },
    { value: 'Sacred Cloak', label: 'Sacred Cloak: A cloak imbued with divine protection' },
    { value: 'Righteous Tabard', label: 'Righteous Tabard: A decorated overgarment showing allegiance' },
  ],
  Ranger: [
    { value: 'Camouflage Cloak', label: 'Camouflage Cloak: A cloak that helps blend with surroundings' },
    { value: 'Leather Armor', label: 'Leather Armor: Light, flexible protection for wilderness travel' },
    { value: 'Scout Gear', label: 'Scout Gear: Practical clothing with many pouches and pockets' },
    { value: 'Forest Garb', label: 'Forest Garb: Clothing designed for moving quietly through nature' },
  ],
  Rogue: [
    { value: 'Shadow Cloak', label: 'Shadow Cloak: Dark clothing perfect for stealth' },
    { value: 'Thieves Garb', label: 'Thieves Garb: Outfit with hidden pockets and tools' },
    { value: 'Infiltrator Suit', label: 'Infiltrator Suit: Sleek attire designed for urban stealth' },
    { value: 'Assassins Vestments', label: 'Assassins Vestments: Dark, form-fitting clothes for deadly precision' },
  ],
  Sorcerer: [
    { value: 'Arcane Robes', label: 'Arcane Robes: Mystical garments with flowing magical patterns' },
    { value: 'Crystal Adorned Cloak', label: 'Crystal Adorned Cloak: A cloak decorated with magical crystals' },
    { value: 'Spellweave Garments', label: 'Spellweave Garments: Clothes woven with magical threads' },
    { value: 'Chaos Vestments', label: 'Chaos Vestments: Robes that shift and change with magical energy' },
  ],
  Warlock: [
    { value: 'Pact Robes', label: 'Pact Robes: Dark robes sealed with otherworldly power' },
    { value: 'Eldritch Vestments', label: 'Eldritch Vestments: Clothing marked with mysterious symbols' },
    { value: 'Patron Garb', label: 'Patron Garb: Attire that reflects their supernatural patron' },
    { value: 'Soul Shroud', label: 'Soul Shroud: A cloak that radiates dark energy' },
  ],
  Wizard: [
    { value: 'Scholarly Robes', label: 'Scholarly Robes: Traditional wizardly attire with magical symbols' },
    { value: 'Enchanted Cloak', label: 'Enchanted Cloak: A cloak with embedded magical properties' },
    { value: 'Runic Vestments', label: 'Runic Vestments: Clothes inscribed with magical runes' },
    { value: 'Astral Garments', label: 'Astral Garments: Robes that shimmer with cosmic energy' },
  ],
  Artificer: [
    { value: 'Inventor Outfit', label: 'Inventor Outfit: Practical clothing with tool attachments' },
    { value: 'Mechanical Armor', label: 'Mechanical Armor: Armor with integrated gadgets' },
    { value: 'Workshop Garb', label: 'Workshop Garb: Durable clothing for crafting and inventing' },
    { value: 'Tech Harness', label: 'Tech Harness: A harness system for carrying inventions' },
  ],
  Trollslayer: [
    { value: 'Slayer Oath Garments', label: 'Slayer Oath Garments: Distinctive orange-dyed clothing' },
    { value: 'Trophy Belt', label: 'Trophy Belt: A belt adorned with monster trophies' },
    { value: 'War Paint Vest', label: 'War Paint Vest: A vest marked with ritual war paint' },
    { value: 'Battle Scars Harness', label: 'Battle Scars Harness: Minimal armor showing battle scars' },
  ],
  Berserker: [
    { value: 'War Paint', label: 'War Paint: Ritual markings that inspire fear' },
    { value: 'Blood-Stained Furs', label: 'Blood-Stained Furs: Trophy furs from fierce battles' },
    { value: 'Rage Harness', label: 'Rage Harness: Minimal armor for maximum mobility' },
    { value: 'Battle Trophies', label: 'Battle Trophies: A collection of war prizes worn as armor' },
  ],
  'Dragon Trainer': [
    { value: 'Scale Armor', label: 'Scale Armor: Armor crafted from shed dragon scales' },
    { value: 'Rider Gear', label: 'Rider Gear: Special equipment for dragon riding' },
    { value: 'Handler Suit', label: 'Handler Suit: Heat-resistant clothing for working with dragons' },
    { value: 'Dragonhide Cloak', label: 'Dragonhide Cloak: A cloak made from treated dragon hide' },
  ],
  Politician: [
    { value: "Diplomat's Robe", label: "Diplomat's Robe: Elegant clothing with intricate embroidery to signify status" },
    { value: 'Velvet Doublet', label: 'Velvet Doublet: A luxurious garment showcasing their wealth and power' },
    { value: 'Ceremonial Sash', label: 'Ceremonial Sash: A formal accessory denoting rank or allegiance' },
    { value: "Courtier's Attire", label: "Courtier's Attire: Practical yet refined clothing for social maneuvering" },
  ],
};
