import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNameSelection } from "@/hooks/useNameSelection";
import { Loader2 } from "lucide-react";

interface NameSelectionProps {
  onNameSelected: (characterId: string) => void;
}

export const NameSelection = ({ onNameSelected }: NameSelectionProps) => {
  const {
    characterName,
    setCharacterName,
    isSubmitting,
    isValidating,
    handleSubmit
  } = useNameSelection(onNameSelected);

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-['Cinzel'] text-center mb-8 text-white">Name Your Character</h1>
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Enter character name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="font-['Cinzel'] text-lg placeholder:text-gray-400 bg-white/20 text-white border-white/20"
            disabled={isSubmitting || isValidating}
            required
            minLength={2}
            maxLength={50}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-white/70" />
            </div>
          )}
        </div>
        <Button 
          type="submit"
          className="w-full bg-white/20 hover:bg-white/30 text-white font-['Cinzel'] relative"
          disabled={isSubmitting || isValidating || !characterName.trim()}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </span>
          ) : (
            "Create Character"
          )}
        </Button>
      </div>
    </form>
  );
};