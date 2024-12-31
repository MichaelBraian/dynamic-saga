import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { GenderSelection } from "@/components/GenderSelection";

const CreateCharacter = () => {
  const [characterName, setCharacterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      const { data: characters, error } = await supabase
        .from('characters')
        .select('name, created_at, status, gender')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching characters:', error);
        return;
      }

      console.log('Your characters:', characters);
    };

    fetchCharacters();
  }, []);

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
        return;
      }

      // Check for duplicate names using maybeSingle() instead of single()
      const { data: existingCharacter, error: checkError } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', characterName.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for duplicate names:', checkError);
        toast({
          title: "Error",
          description: "There was a problem checking the character name. Please try again.",
          variant: "destructive",
          className: "inline-flex max-w-fit rounded-md bg-destructive px-3 py-2",
        });
        setIsSubmitting(false);
        return;
      }

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
        className: "inline-flex max-w-fit items-center gap-2 rounded-md bg-background/60 px-3 py-2 backdrop-blur-sm",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">Character saved</span>
          </div>
        ),
        duration: 2000,
      });

      setCharacterId(data.id);
      
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

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp')`
      }}
    >
      <HamburgerMenu />
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        {!characterId ? (
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
        ) : (
          <GenderSelection characterId={characterId} />
        )}
      </div>
    </div>
  );
};

export default CreateCharacter;