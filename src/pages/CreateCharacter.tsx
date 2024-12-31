import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";

const CreateCharacter = () => {
  const [characterName, setCharacterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!characterName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your character",
        variant: "destructive",
        className: "bg-destructive text-destructive-foreground inline-flex max-w-fit",
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
          className: "bg-destructive text-destructive-foreground inline-flex max-w-fit",
        });
        return;
      }

      const { data, error } = await supabase
        .from('characters')
        .insert([
          {
            name: characterName.trim(),
            user_id: user.id,
            status: 'naming'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        className: "bg-background/50 backdrop-blur-sm border-green-500 inline-flex max-w-fit",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Character saved</span>
          </div>
        ),
        duration: 2000,
      });

      // TODO: Navigate to the next step (questions) once implemented
      console.log("Character created:", data);
      
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your character. Please try again.",
        variant: "destructive",
        className: "bg-destructive text-destructive-foreground inline-flex max-w-fit",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp')`
      }}
    >
      <HamburgerMenu />
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-['Cinzel'] text-center mb-8 text-white">Name Your Character</h1>
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
      </div>
    </div>
  );
};

export default CreateCharacter;