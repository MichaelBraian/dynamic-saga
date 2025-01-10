import type { RaceWithAnimalTypes } from '@/types/race';
import type { ClassWithSpecialties } from '@/types/class';

export const mockGenderOptions = [
  { 
    value: 'male' as const, 
    label: 'Male',
    pronouns: {
      subject: 'he',
      object: 'him',
      possessive: 'his',
    },
  },
  { 
    value: 'female' as const, 
    label: 'Female',
    pronouns: {
      subject: 'she',
      object: 'her',
      possessive: 'hers',
    },
  },
];

export const mockRaces: RaceWithAnimalTypes[] = [
  {
    id: '1',
    name: 'Human',
    description: 'Versatile and ambitious, humans are the most adaptable of all races.',
    abilities: ['Adaptable', 'Skilled', 'Ambitious'],
    available_animal_types: false,
    created_at: null,
    updated_at: null,
    animal_types: [],
  },
  {
    id: '2',
    name: 'Elf',
    description: 'Graceful and long-lived, elves are masters of magic and artistry.',
    abilities: ['Keen Senses', 'Magic Affinity', 'Longevity'],
    available_animal_types: false,
    created_at: null,
    updated_at: null,
    animal_types: [],
  },
  {
    id: '3',
    name: 'Dwarf',
    description: 'Strong and sturdy, dwarves are master craftsmen and warriors.',
    abilities: ['Darkvision', 'Stonecunning', 'Dwarven Resilience'],
    available_animal_types: false,
    created_at: null,
    updated_at: null,
    animal_types: [],
  },
  {
    id: '4',
    name: 'Shapeshifter',
    description: 'Masters of transformation, able to take on animal forms.',
    abilities: ['Shapeshifting', 'Natural Empathy', 'Enhanced Senses'],
    available_animal_types: true,
    created_at: null,
    updated_at: null,
    animal_types: [
      {
        id: '1',
        name: 'Wolf',
        abilities: ['Pack Tactics', 'Keen Hearing and Smell'],
        description: 'Swift and social predator with enhanced senses.',
      },
      {
        id: '2',
        name: 'Bear',
        abilities: ['Powerful Build', 'Natural Weapons'],
        description: 'Strong and resilient with powerful attacks.',
      },
      {
        id: '3',
        name: 'Eagle',
        abilities: ['Flight', 'Keen Eyesight'],
        description: 'Majestic bird with superior vision and flight capabilities.',
      },
    ],
  },
  {
    id: '5',
    name: 'Dragonborn',
    description: 'Proud dragon-blooded warriors with breath weapons.',
    abilities: ['Dragon Breath', 'Dragon Resistance', 'Imposing Presence'],
    available_animal_types: false,
    created_at: null,
    updated_at: null,
    animal_types: [],
  },
];

export const mockClasses: ClassWithSpecialties[] = [
  {
    id: '1',
    name: 'Warrior',
    overview: 'Master of martial combat and battlefield tactics.',
    traits: ['Weapon Mastery', 'Combat Expertise', 'Battle Leadership'],
    specialties: [
      {
        id: '1',
        name: 'Berserker',
        description: 'A warrior who channels their inner rage to become a devastating force on the battlefield.',
        abilities: ['Rage', 'Reckless Attack', 'Brutal Critical'],
      },
      {
        id: '2',
        name: 'Champion',
        description: 'A master of physical perfection and combat efficiency.',
        abilities: ['Improved Critical', 'Remarkable Athlete', 'Superior Defense'],
      },
    ],
  },
  {
    id: '2',
    name: 'Mage',
    overview: 'Wielder of arcane magic and ancient knowledge.',
    traits: ['Spellcasting', 'Arcane Recovery', 'Magical Research'],
    specialties: [
      {
        id: '3',
        name: 'Elementalist',
        description: 'A mage who specializes in controlling the fundamental forces of nature.',
        abilities: ['Elemental Affinity', 'Energy Shield', 'Force of Nature'],
      },
      {
        id: '4',
        name: 'Enchanter',
        description: 'A master of mind-affecting magic and subtle manipulation.',
        abilities: ['Enchantment Savant', 'Hypnotic Gaze', 'Split Enchantment'],
      },
    ],
  },
  {
    id: '3',
    name: 'Rogue',
    overview: 'Expert in stealth, subterfuge, and precision strikes.',
    traits: ['Sneak Attack', 'Cunning Action', 'Evasion'],
    specialties: [
      {
        id: '5',
        name: 'Assassin',
        description: 'A master of dealing death from the shadows.',
        abilities: ['Assassinate', 'Infiltration Expertise', 'Death Strike'],
      },
      {
        id: '6',
        name: 'Thief',
        description: 'The quintessential burglar and treasure hunter.',
        abilities: ['Fast Hands', 'Second-Story Work', 'Supreme Sneak'],
      },
    ],
  },
  {
    id: '4',
    name: 'Cleric',
    overview: 'Divine spellcaster and channel of holy power.',
    traits: ['Divine Magic', 'Channel Divinity', 'Divine Intervention'],
    specialties: [
      {
        id: '7',
        name: 'Life Domain',
        description: 'A healer who channels positive energy to cure wounds and restore life.',
        abilities: ['Preserve Life', 'Blessed Healer', 'Supreme Healing'],
      },
      {
        id: '8',
        name: 'War Domain',
        description: 'A battle priest who calls upon divine might in combat.',
        abilities: ['War Priest', 'Guided Strike', 'Avatar of Battle'],
      },
    ],
  },
  {
    id: '5',
    name: 'Ranger',
    overview: 'Skilled hunter and master of the wilderness.',
    traits: ['Natural Explorer', 'Favored Enemy', 'Beast Master'],
    specialties: [
      {
        id: '9',
        name: 'Hunter',
        description: 'A specialist in bringing down dangerous prey.',
        abilities: ['Colossus Slayer', 'Multiattack Defense', 'Stand Against the Tide'],
      },
      {
        id: '10',
        name: 'Beast Master',
        description: 'Forms a mystical bond with an animal companion.',
        abilities: ['Animal Companion', 'Exceptional Training', 'Share Spells'],
      },
    ],
  },
  {
    id: '6',
    name: 'Paladin',
    overview: 'Holy warrior combining martial prowess with divine power.',
    traits: ['Divine Smite', 'Lay on Hands', 'Divine Sense'],
    specialties: [
      {
        id: '11',
        name: 'Oath of Devotion',
        description: 'The archetypal knight in shining armor, sworn to uphold justice and righteousness.',
        abilities: ['Sacred Weapon', 'Divine Health', 'Holy Nimbus'],
      },
      {
        id: '12',
        name: 'Oath of Vengeance',
        description: 'A holy avenger who hunts the wicked and brings them to justice.',
        abilities: ['Avenging Angel', 'Relentless Avenger', 'Soul of Vengeance'],
      },
    ],
  },
];

// Mock API service
export const mockCharacterApi = {
  genders: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockGenderOptions;
    },
  },
  races: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockRaces;
    },
  },
  classes: {
    list: async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockClasses;
    },
  },
  // Add more mock endpoints as needed
}; 