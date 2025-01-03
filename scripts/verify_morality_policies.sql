-- First, check if RLS is enabled
SELECT relname as table_name, relrowsecurity as rls_enabled
FROM pg_class
WHERE relname = 'character_morality';

-- List existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'character_morality';

-- Enable RLS if not already enabled
ALTER TABLE public.character_morality ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
    -- Check and create SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'character_morality' 
        AND policyname = 'Users can view their own character''s morality'
    ) THEN
        CREATE POLICY "Users can view their own character's morality"
        ON public.character_morality
        FOR SELECT
        USING (auth.uid() IN (
            SELECT user_id FROM characters WHERE id = character_id
        ));
    END IF;

    -- Check and create INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'character_morality' 
        AND policyname = 'Users can insert their own character''s morality'
    ) THEN
        CREATE POLICY "Users can insert their own character's morality"
        ON public.character_morality
        FOR INSERT
        WITH CHECK (auth.uid() IN (
            SELECT user_id FROM characters WHERE id = character_id
        ));
    END IF;

    -- Check and create UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'character_morality' 
        AND policyname = 'Users can update their own character''s morality'
    ) THEN
        CREATE POLICY "Users can update their own character's morality"
        ON public.character_morality
        FOR UPDATE
        USING (auth.uid() IN (
            SELECT user_id FROM characters WHERE id = character_id
        ));
    END IF;
END $$; 