import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Trash2, CheckSquare, Square } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Character {
  id: string;
  name: string;
  created_at: string;
}

const CharacterList = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchCharacters = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('characters')
        .select('id, name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching characters:', error);
        return;
      }

      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleCharacterSelection = (characterId: string) => {
    const newSelection = new Set(selectedCharacters);
    if (newSelection.has(characterId)) {
      newSelection.delete(characterId);
    } else {
      newSelection.add(characterId);
    }
    setSelectedCharacters(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedCharacters.size === characters.length) {
      setSelectedCharacters(new Set());
    } else {
      setSelectedCharacters(new Set(characters.map(char => char.id)));
    }
  };

  const deleteSelectedCharacters = async () => {
    setLoading(true);
    const characterIds = Array.from(selectedCharacters);
    
    try {
      // First delete from character_specialties
      const { error: specialtiesError } = await supabase
        .from('character_specialties')
        .delete()
        .in('character_id', characterIds);

      if (specialtiesError) {
        console.error('Error deleting specialties:', specialtiesError);
        toast({
          title: "Error",
          description: "Failed to delete character specialties. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Then delete from character_attributes
      const { error: attributesError } = await supabase
        .from('character_attributes')
        .delete()
        .in('character_id', characterIds);

      if (attributesError) {
        console.error('Error deleting attributes:', attributesError);
        toast({
          title: "Error",
          description: "Failed to delete character attributes. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Finally delete the characters
      const { error: charactersError } = await supabase
        .from('characters')
        .delete()
        .in('id', characterIds);

      if (charactersError) {
        console.error('Error deleting characters:', charactersError);
        toast({
          title: "Error",
          description: "Failed to delete characters. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Deleted ${characterIds.length} character(s).`,
      });

      setSelectedCharacters(new Set());
      setIsSelectionMode(false);
      fetchCharacters();
    } catch (error) {
      console.error('Error deleting characters:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold font-['Cinzel']">Your Characters</h1>
        </div>

        {characters.length === 0 ? (
          <Card className="bg-black/40 border border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-white/80 mb-4">You haven't created any characters yet.</p>
              <Button 
                onClick={() => navigate('/create-character')}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                Create Your First Character
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setIsSelectionMode(!isSelectionMode);
                    setSelectedCharacters(new Set());
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  {isSelectionMode ? "Cancel" : "Select"}
                </Button>
                {isSelectionMode && (
                  <>
                    <Button 
                      onClick={toggleSelectAll}
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      {selectedCharacters.size === characters.length ? "Deselect All" : "Select All"}
                    </Button>
                    <Button 
                      onClick={() => setShowDeleteDialog(true)}
                      className="bg-red-500/80 hover:bg-red-500 text-white"
                      disabled={selectedCharacters.size === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedCharacters.size})
                    </Button>
                  </>
                )}
              </div>
              {!isSelectionMode && (
                <Button 
                  onClick={() => navigate('/create-character')}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Create New Character
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((character) => (
                <Card 
                  key={character.id} 
                  className={`bg-black/40 border transition-colors cursor-pointer ${
                    isSelectionMode
                      ? selectedCharacters.has(character.id)
                        ? 'border-white/40 bg-white/10'
                        : 'border-white/10 hover:border-white/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => isSelectionMode ? toggleCharacterSelection(character.id) : navigate(`/character/${character.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {isSelectionMode && (
                        <div className="mt-1">
                          {selectedCharacters.has(character.id) ? (
                            <CheckSquare className="h-5 w-5 text-white" />
                          ) : (
                            <Square className="h-5 w-5 text-white/60" />
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="font-['Cinzel'] text-white">{character.name}</CardTitle>
                        <p className="text-white/60 text-sm">
                          Created: {formatDate(character.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {!isSelectionMode && (
                    <CardContent>
                      <Button 
                        className="w-full bg-white/10 hover:bg-white/20 text-white"
                      >
                        View Character
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-black/90 border border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Characters</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Are you sure you want to delete {selectedCharacters.size} character(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteSelectedCharacters}
              className="bg-red-500/80 hover:bg-red-500 text-white border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CharacterList; 