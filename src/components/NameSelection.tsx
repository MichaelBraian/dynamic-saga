import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createCharacter, checkCharacterNameExists } from "@/services/characterService";
import { createSuccessToast, createErrorToast } from "@/utils/characterCreationToasts";

interface NameSelectionProps {
  onNameSelected: (characterId: string) => void;
}

export const NameSelection = ({ onNameSelected }: NameSelectionProps) => {
  const [characterName, setCharacterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!characterName.trim()) {
      toast(createErrorToast("Name required", "Please enter a name for your character"));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast(createErrorToast("Error", "You must be logged in to create a character"));
        return;
      }

      const existingCharacter = await checkCharacterNameExists(characterName, user.id);
      if (existingCharacter) {
        toast(createErrorToast(
          "Name already exists",
          "Please choose a different name for your character"
        ));
        return;
      }

      const character = await createCharacter(characterName, user.id);
      toast(createSuccessToast("Character saved"));
      onNameSelected(character.id);
    } catch (error) {
      console.error('Error creating character:', error);
      toast(createErrorToast(
        "Error",
        "There was a problem creating your character. Please try again."
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-['Cinzel'] text-center mb-8 text-white">
        Name Your Character
      </h1>
      <div className="space-y-4">
        <Input
          placeholder="Enter character name"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          className="font-['Cinzel'] text-lg placeholder:text-gray-400 bg-white/20 text-white border-white/20"
          disabled={isSubmitting}
        />
        <Button 
          type="submit"
          className="w-full bg-white/20 hover:bg-white/30 text-white font-['Cinzel']"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Character"}
        </Button>
      </div>
    </form>
  );
};