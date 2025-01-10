-- Create character attributes table
CREATE TABLE IF NOT EXISTS public.character_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    strength INTEGER NOT NULL CHECK (strength >= 1 AND strength <= 20),
    dexterity INTEGER NOT NULL CHECK (dexterity >= 1 AND dexterity <= 20),
    constitution INTEGER NOT NULL CHECK (constitution >= 1 AND constitution <= 20),
    intelligence INTEGER NOT NULL CHECK (intelligence >= 1 AND intelligence <= 20),
    wisdom INTEGER NOT NULL CHECK (wisdom >= 1 AND wisdom <= 20),
    charisma INTEGER NOT NULL CHECK (charisma >= 1 AND charisma <= 20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create character equipment table
CREATE TABLE IF NOT EXISTS public.character_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.equipment_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    equipped BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policies
ALTER TABLE public.character_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_equipment ENABLE ROW LEVEL SECURITY;

-- Create policies for character attributes
CREATE POLICY "Users can view their own character attributes"
    ON public.character_attributes
    FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own character attributes"
    ON public.character_attributes
    FOR INSERT
    WITH CHECK (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own character attributes"
    ON public.character_attributes
    FOR UPDATE
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own character attributes"
    ON public.character_attributes
    FOR DELETE
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE user_id = auth.uid()
        )
    );

-- Create policies for character equipment
CREATE POLICY "Users can view their own character equipment"
    ON public.character_equipment
    FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own character equipment"
    ON public.character_equipment
    FOR INSERT
    WITH CHECK (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own character equipment"
    ON public.character_equipment
    FOR UPDATE
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own character equipment"
    ON public.character_equipment
    FOR DELETE
    USING (
        profile_id IN (
            SELECT id FROM public.profiles
            WHERE user_id = auth.uid()
        )
    ); 