-- Create races table
CREATE TABLE IF NOT EXISTS public.races (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    abilities TEXT[] NOT NULL DEFAULT '{}',
    available_animal_types BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create animal_types table
CREATE TABLE IF NOT EXISTS public.animal_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    race_id UUID REFERENCES public.races(id),
    abilities TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(name, race_id)
);

-- Create attributes table
CREATE TABLE IF NOT EXISTS public.character_attributes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    strength INTEGER NOT NULL DEFAULT 10,
    dexterity INTEGER NOT NULL DEFAULT 10,
    constitution INTEGER NOT NULL DEFAULT 10,
    intelligence INTEGER NOT NULL DEFAULT 10,
    wisdom INTEGER NOT NULL DEFAULT 10,
    charisma INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT attribute_range CHECK (
        strength BETWEEN 1 AND 20 AND
        dexterity BETWEEN 1 AND 20 AND
        constitution BETWEEN 1 AND 20 AND
        intelligence BETWEEN 1 AND 20 AND
        wisdom BETWEEN 1 AND 20 AND
        charisma BETWEEN 1 AND 20
    )
);

-- Create morality_alignments table
CREATE TABLE IF NOT EXISTS public.morality_alignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    good_evil_scale INTEGER NOT NULL DEFAULT 0, -- -5 (Evil) to 5 (Good)
    lawful_chaotic_scale INTEGER NOT NULL DEFAULT 0, -- -5 (Chaotic) to 5 (Lawful)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT alignment_range CHECK (
        good_evil_scale BETWEEN -5 AND 5 AND
        lawful_chaotic_scale BETWEEN -5 AND 5
    )
);

-- Create faiths table
CREATE TABLE IF NOT EXISTS public.faiths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    abilities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create character_faiths table (for faith points and relationships)
CREATE TABLE IF NOT EXISTS public.character_faiths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    faith_id UUID REFERENCES public.faiths(id),
    devotion_level INTEGER NOT NULL DEFAULT 1,
    faith_points INTEGER NOT NULL DEFAULT 0,
    abilities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT devotion_range CHECK (devotion_level BETWEEN 1 AND 10),
    CONSTRAINT faith_points_range CHECK (faith_points >= 0)
);

-- Create specialties table
CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    class_id UUID REFERENCES public.character_classes(id),
    description TEXT NOT NULL,
    abilities TEXT[] NOT NULL DEFAULT '{}',
    requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create character_specialties table
CREATE TABLE IF NOT EXISTS public.character_specialties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES public.specialties(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create backgrounds table
CREATE TABLE IF NOT EXISTS public.backgrounds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    personality_traits TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create character_backgrounds table
CREATE TABLE IF NOT EXISTS public.character_backgrounds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    background_id UUID REFERENCES public.backgrounds(id),
    history TEXT,
    personality_traits TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create equipment_items table
CREATE TABLE IF NOT EXISTS public.equipment_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- weapon, armor, accessory, etc.
    description TEXT NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create character_equipment table
CREATE TABLE IF NOT EXISTS public.character_equipment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.equipment_items(id),
    equipped BOOLEAN NOT NULL DEFAULT false,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT quantity_positive CHECK (quantity > 0)
);

-- Add appearance and description columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS current_step INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS animal_type_id UUID REFERENCES public.animal_types(id),
ADD CONSTRAINT status_check CHECK (status IN ('draft', 'complete'));

-- Create updated_at trigger for all tables that need it
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER handle_character_attributes_updated_at
    BEFORE UPDATE ON public.character_attributes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_morality_alignments_updated_at
    BEFORE UPDATE ON public.morality_alignments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_character_faiths_updated_at
    BEFORE UPDATE ON public.character_faiths
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_character_backgrounds_updated_at
    BEFORE UPDATE ON public.character_backgrounds
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_character_equipment_updated_at
    BEFORE UPDATE ON public.character_equipment
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morality_alignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faiths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_faiths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_equipment ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Read-only policies for reference tables
CREATE POLICY "Anyone can read races" ON public.races FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read animal_types" ON public.animal_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read faiths" ON public.faiths FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read specialties" ON public.specialties FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read backgrounds" ON public.backgrounds FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read equipment_items" ON public.equipment_items FOR SELECT TO authenticated USING (true);

-- Character-specific table policies
CREATE POLICY "Users can read own character attributes" ON public.character_attributes
    FOR SELECT TO authenticated
    USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own character attributes" ON public.character_attributes
    FOR UPDATE TO authenticated
    USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Similar policies for other character-specific tables
CREATE POLICY "Users can read own morality alignments" ON public.morality_alignments
    FOR SELECT TO authenticated
    USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own morality alignments" ON public.morality_alignments
    FOR UPDATE TO authenticated
    USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())); 