import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const useNameSelection = (onNameSelected: (characterId: string) => void) => {
  const [characterName, setCharacterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!characterName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your character",
        variant: "destructive",
        className: "inline-flex max-w-fit rounded-md bg-destructive px-3 py-2",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a character",
          variant: "destructive",
          className: "inline-flex max-w-fit rounded-md bg-destructive px-3 py-2",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: existingCharacter, error: checkError } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', characterName.trim())
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingCharacter) {
        toast({
          title: "Name already exists",
          description: "Please choose a different name for your character",
          variant: "destructive",
          className: "inline-flex max-w-fit rounded-md bg-destructive px-3 py-2",
        });
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from('characters')
        .insert([{
          name: characterName.trim(),
          user_id: user.id,
          status: 'gender'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        className: "inline-flex h-8 items-center gap-2 rounded-md bg-background/60 px-3 backdrop-blur-sm",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Character created successfully</span>
          </div>
        ),
        duration: 2000,
      });

      if (data) {
        onNameSelected(data.id);
      }
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your character. Please try again.",
        variant: "destructive",
        className: "inline-flex max-w-fit rounded-md bg-destructive px-3 py-2",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    characterName,
    setCharacterName,
    isSubmitting,
    handleSubmit
  };
};