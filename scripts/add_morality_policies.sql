-- Enable RLS
ALTER TABLE public.character_morality ENABLE ROW LEVEL SECURITY;

-- Add SELECT policy
CREATE POLICY "Users can view their own character's morality"
ON public.character_morality
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM characters WHERE id = character_id
));

-- Add INSERT policy
CREATE POLICY "Users can insert their own character's morality"
ON public.character_morality
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM characters WHERE id = character_id
));

-- Add UPDATE policy
CREATE POLICY "Users can update their own character's morality"
ON public.character_morality
FOR UPDATE
USING (auth.uid() IN (
  SELECT user_id FROM characters WHERE id = character_id
)); 