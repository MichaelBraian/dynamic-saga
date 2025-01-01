import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UseNameSelectionReturn {
  characterName: string;
  setCharacterName: (name: string) => void;
  isSubmitting: boolean;
  isValidating: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useNameSelection = (onNameSelected: (characterId: string) => void): UseNameSelectionReturn => {
  const [characterName, setCharacterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateName = async (name: string): Promise<boolean> => {
    setError(null);
    
    if (!name.trim() || name.length < 2 || name.length > 50) {
      setError("Name must be between 2 and 50 characters");
      return false;
    }

    setIsValidating(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setError("Authentication required");
        return false;
      }

      const { data: existingCharacter, error: checkError } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking character name:', checkError);
        setError("Failed to validate character name");
        return false;
      }

      if (existingCharacter) {
        setError("This name is already taken");
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating character name:', error);
      setError(error instanceof Error ? error.message : "Failed to validate character name");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!characterName.trim()) {
      setError("Please enter a name for your character");
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

      console.log('Character created successfully:', data);

      toast({
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Character created successfully</span>
          </div>
        ),
        duration: 2000,
      });

      // Ensure we call onNameSelected with the new character ID
      onNameSelected(data.id);
    } catch (error) {
      console.error('Error creating character:', error);
      setError(error instanceof Error ? error.message : "There was a problem creating your character");
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "There was a problem creating your character",
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
    error,
    handleSubmit
  };
};