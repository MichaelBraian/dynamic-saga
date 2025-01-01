import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const useNameSelection = (onNameSelected: (characterId: string) => void) => {
  const [characterName, setCharacterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateName = async (name: string): Promise<boolean> => {
    if (!name.trim() || name.length < 2 || name.length > 50) {
      toast({
        variant: "destructive",
        description: "Name must be between 2 and 50 characters",
      });
      return false;
    }

    setIsValidating(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Authentication required");
      }

      // Check for existing character name
      const { data: existingCharacter, error: checkError } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking character name:', checkError);
        throw new Error("Failed to validate character name");
      }

      if (existingCharacter) {
        toast({
          title: "Name already exists",
          description: "Please choose a different name for your character",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating character name:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to validate character name",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!characterName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your character",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const isValid = await validateName(characterName);
      if (!isValid) {
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Authentication required");
      }

      // Create new character
      const { data, error } = await supabase
        .from('characters')
        .insert([{
          name: characterName.trim(),
          user_id: user.id,
          status: 'gender'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating character:', error);
        throw new Error("Failed to create character");
      }

      if (!data?.id) {
        throw new Error("Failed to create character - no ID returned");
      }

      toast({
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Character created successfully</span>
          </div>
        ),
        duration: 2000,
      });

      onNameSelected(data.id);
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem creating your character",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    characterName,
    setCharacterName,
    isSubmitting,
    isValidating,
    handleSubmit
  };
};