-- Create animal_types table
CREATE TABLE IF NOT EXISTS animal_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create attributes table
CREATE TABLE IF NOT EXISTS attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    min_value INTEGER NOT NULL DEFAULT 1,
    max_value INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_attribute_range CHECK (min_value <= max_value)
);

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    gender TEXT,
    pronouns JSONB,
    race_id UUID REFERENCES races(id),
    class_id UUID REFERENCES character_classes(id),
    animal_type_id UUID REFERENCES animal_types(id),
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT status_check CHECK (status IN ('draft', 'complete'))
);

-- Create character_attributes table for storing character's attribute values
CREATE TABLE IF NOT EXISTS character_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attributes(id),
    base_value INTEGER NOT NULL,
    racial_modifier INTEGER DEFAULT 0,
    class_modifier INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(character_id, attribute_id)
);

-- Add RLS Policies
ALTER TABLE animal_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_attributes ENABLE ROW LEVEL SECURITY;

-- Animal Types policies
CREATE POLICY "Allow public read access to animal_types" ON animal_types
    FOR SELECT TO public USING (true);

-- Attributes policies
CREATE POLICY "Allow public read access to attributes" ON attributes
    FOR SELECT TO public USING (true);

-- Characters policies
CREATE POLICY "Users can create their own characters" ON characters
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own characters" ON characters
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" ON characters
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" ON characters
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Character Attributes policies
CREATE POLICY "Users can manage their character attributes" ON character_attributes
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM characters
        WHERE characters.id = character_attributes.character_id
        AND characters.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM characters
        WHERE characters.id = character_attributes.character_id
        AND characters.user_id = auth.uid()
    )); 