-- Seed Races
INSERT INTO public.races (name, description, abilities, available_animal_types) VALUES
('Human', 'Versatile and ambitious, humans are the most adaptable of all races.', ARRAY['Adaptable', 'Skilled', 'Ambitious'], false),
('Elf', 'Graceful and long-lived, elves are masters of magic and artistry.', ARRAY['Keen Senses', 'Magic Affinity', 'Longevity'], false),
('Dwarf', 'Strong and sturdy, dwarves are master craftsmen and warriors.', ARRAY['Darkvision', 'Stonecunning', 'Dwarven Resilience'], false),
('Shapeshifter', 'Masters of transformation, able to take on animal forms.', ARRAY['Shapeshifting', 'Natural Empathy', 'Enhanced Senses'], true),
('Dragonborn', 'Proud dragon-blooded warriors with breath weapons.', ARRAY['Dragon Breath', 'Dragon Resistance', 'Imposing Presence'], false),
('Halfling', 'Small but brave, halflings are lucky and nimble.', ARRAY['Lucky', 'Brave', 'Nimble'], false);

-- Seed Animal Types (for Shapeshifters)
INSERT INTO public.animal_types (name, race_id, abilities, description) 
SELECT 'Wolf', id, ARRAY['Pack Tactics', 'Keen Hearing and Smell'], 'Swift and social predator with enhanced senses.'
FROM public.races WHERE name = 'Shapeshifter';

INSERT INTO public.animal_types (name, race_id, abilities, description)
SELECT 'Bear', id, ARRAY['Powerful Build', 'Natural Weapons'], 'Strong and resilient with powerful attacks.'
FROM public.races WHERE name = 'Shapeshifter';

INSERT INTO public.animal_types (name, race_id, abilities, description)
SELECT 'Eagle', id, ARRAY['Flight', 'Keen Eyesight'], 'Majestic bird with superior vision and flight capabilities.'
FROM public.races WHERE name = 'Shapeshifter';

-- Seed Character Classes
INSERT INTO public.character_classes (name, overview, traits) VALUES
('Warrior', 'Master of martial combat and battlefield tactics.', ARRAY['Weapon Mastery', 'Combat Expertise', 'Battle Leadership']),
('Mage', 'Wielder of arcane magic and ancient knowledge.', ARRAY['Spellcasting', 'Arcane Recovery', 'Magical Research']),
('Rogue', 'Expert in stealth, subterfuge, and precision strikes.', ARRAY['Sneak Attack', 'Cunning Action', 'Evasion']),
('Cleric', 'Divine spellcaster and channel of holy power.', ARRAY['Divine Magic', 'Channel Divinity', 'Divine Intervention']),
('Ranger', 'Skilled hunter and master of the wilderness.', ARRAY['Natural Explorer', 'Favored Enemy', 'Beast Master']),
('Paladin', 'Holy warrior combining martial prowess with divine power.', ARRAY['Divine Smite', 'Lay on Hands', 'Divine Sense']);

-- Seed Faiths
INSERT INTO public.faiths (name, description, abilities) VALUES
('Light of Dawn', 'Followers of the sun deity, bringing hope and healing.', ARRAY['Divine Light', 'Solar Blessing', 'Radiant Shield']),
('Shadow Covenant', 'Servants of the night, masters of darkness and secrets.', ARRAY['Shadow Walk', 'Dark Blessing', 'Night''s Embrace']),
('Nature''s Path', 'Worshippers of the natural world and its cycles.', ARRAY['Nature''s Blessing', 'Wild Empathy', 'Earth''s Strength']),
('Storm Lords', 'Devotees of the tempest, wielding thunder and lightning.', ARRAY['Storm Call', 'Thunder Strike', 'Wind Walker']);

-- Seed Backgrounds
INSERT INTO public.backgrounds (name, description, personality_traits) VALUES
('Noble', 'Born to privilege and trained in leadership.', ARRAY['Commanding Presence', 'Educated', 'Refined Manners']),
('Street Urchin', 'Survivor of the harsh city streets.', ARRAY['Street Smart', 'Nimble', 'Resourceful']),
('Scholar', 'Dedicated student of knowledge and lore.', ARRAY['Well-Read', 'Analytical', 'Curious']),
('Soldier', 'Veteran of military service and warfare.', ARRAY['Disciplined', 'Tactical', 'Battle-Hardened']);

-- Seed Equipment Items
INSERT INTO public.equipment_items (name, type, description, properties) VALUES
('Longsword', 'weapon', 'Versatile blade favored by warriors.', '{"damage": "1d8", "weight": 3, "properties": ["versatile", "martial"]}'::jsonb),
('Staff of Power', 'weapon', 'Ancient staff crackling with magical energy.', '{"damage": "1d6", "weight": 4, "properties": ["magical", "spellcasting"]}'::jsonb),
('Leather Armor', 'armor', 'Flexible armor made from treated hide.', '{"armor_class": 11, "weight": 10, "properties": ["light"]}'::jsonb),
('Healing Potion', 'consumable', 'Red liquid that restores health.', '{"healing": "2d4+2", "weight": 0.5, "properties": ["consumable"]}'::jsonb);

-- Seed Race-Class Restrictions
INSERT INTO public.race_class_restrictions (race_name, class_name, is_restricted, restriction_reason) VALUES
('Shapeshifter', 'Mage', true, 'Shapeshifters cannot maintain proper spellcasting focus while transformed.'),
('Dwarf', 'Druid', false, null),
('Elf', 'Warlock', false, null),
('Human', 'Paladin', false, null),
('Dragonborn', 'Rogue', true, 'Dragonborn physiology makes stealth extremely difficult.'); 