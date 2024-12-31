import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNameSelection } from "@/hooks/useNameSelection";

interface NameSelectionProps {
  onNameSelected: (characterId: string) => void;
}

export const NameSelection = ({ onNameSelected }: NameSelectionProps) => {
  const {
    characterName,
    setCharacterName,
    isSubmitting,
    handleSubmit
  } = useNameSelection(onNameSelected);

  return (
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
  );
};