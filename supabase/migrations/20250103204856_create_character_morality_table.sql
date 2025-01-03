CREATE TABLE IF NOT EXISTS public.character_morality (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES public.characters(id),
  good_evil_scale INTEGER,
  lawful_chaotic_scale INTEGER,
  alignment_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add a unique constraint to ensure one morality score per character
ALTER TABLE public.character_morality ADD CONSTRAINT character_morality_character_id_key UNIQUE (character_id);

-- Add RLS policies
ALTER TABLE public.character_morality ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own character's morality"
  ON public.character_morality
  FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM characters WHERE id = character_id
  ));

CREATE POLICY "Users can update their own character's morality"
  ON public.character_morality
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM characters WHERE id = character_id
  ));

CREATE POLICY "Users can insert their own character's morality"
  ON public.character_morality
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM characters WHERE id = character_id
  ));
